/**
 * Advanced Caching Utilities for Prisma Accelerate
 * 
 * This file provides advanced patterns and utilities for effective caching
 * with Prisma Accelerate's global caching layer.
 */

import { prisma } from './prisma';
import { cacheStrategies } from './cache-strategies';

/**
 * Cache-aware query wrapper with automatic fallback
 * Provides graceful degradation if caching fails
 */
export async function cacheAwareQuery<T>(
  queryFn: () => Promise<T>,
  fallbackQueryFn?: () => Promise<T>
): Promise<T> {
  try {
    return await queryFn();
  } catch (error) {
    console.warn('Cached query failed, falling back to uncached query:', error);
    if (fallbackQueryFn) {
      return await fallbackQueryFn();
    }
    throw error;
  }
}

/**
 * Conditional caching based on environment
 * Disable caching in development or testing environments
 */
export function getEnvironmentAwareCacheStrategy(strategy: { swr: number; ttl: number }) {
  // Disable caching in development for immediate data updates
  if (process.env.NODE_ENV === 'development') {
    return undefined;
  }
  
  // Shorter cache times in staging
  if (process.env.VERCEL_ENV === 'preview' || process.env.APP_ENV === 'staging') {
    return {
      swr: Math.floor(strategy.swr / 2),
      ttl: Math.floor(strategy.ttl / 2),
    };
  }
  
  return strategy;
}

/**
 * Multi-layer caching strategy
 * Combines different cache strategies for optimal performance
 */
export class CacheManager {
  /**
   * Get laptops with intelligent caching based on user type
   */
  static async getLaptopsForUser(userType: 'admin' | 'public' = 'public') {
    const strategy = userType === 'admin' 
      ? cacheStrategies.adminListing 
      : cacheStrategies.public;

    return await prisma.laptop.findMany({
      where: userType === 'public' ? { published: true } : undefined,
      orderBy: userType === 'public' 
        ? { datePublished: 'desc' } 
        : { id: 'desc' },
      include: { images: { orderBy: { position: 'asc' } } },
      cacheStrategy: getEnvironmentAwareCacheStrategy(strategy),
    });
  }

  /**
   * Cached search with fallback to uncached search
   */
  static async searchLaptops(query: string, limit: number = 10) {
    return await cacheAwareQuery(
      () => prisma.laptop.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
          published: true,
        },
        take: limit,
        include: { images: { take: 1, orderBy: { position: 'asc' } } },
        cacheStrategy: cacheStrategies.public,
      }),
      // Fallback to uncached query if cached search fails
      () => prisma.laptop.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
          published: true,
        },
        take: limit,
        include: { images: { take: 1, orderBy: { position: 'asc' } } },
      })
    );
  }

  /**
   * Paginated results with caching
   */
  static async getPaginatedLaptops(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;
    
    // For first page, use longer cache since it's accessed most frequently
    const strategy = page === 1 ? cacheStrategies.public : cacheStrategies.adminListing;
    
    const [laptops, total] = await Promise.all([
      prisma.laptop.findMany({
        where: { published: true },
        skip,
        take: pageSize,
        orderBy: { datePublished: 'desc' },
        include: { images: { take: 1, orderBy: { position: 'asc' } } },
        cacheStrategy: strategy,
      }),
      prisma.laptop.count({
        where: { published: true },
        cacheStrategy: cacheStrategies.static, // Count changes rarely
      }),
    ]);

    return {
      laptops,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: skip + pageSize < total,
        hasPrev: page > 1,
      },
    };
  }
}

/**
 * Cache warming utilities
 * Pre-populate cache with frequently accessed data
 */
export class CacheWarmer {
  /**
   * Warm up the cache with most important data
   */
  static async warmEssentialData() {
    try {
      // Warm up published laptops (most accessed)
      await prisma.laptop.findMany({
        where: { published: true },
        take: 20, // Most recent 20 laptops
        orderBy: { datePublished: 'desc' },
        include: { images: { take: 1, orderBy: { position: 'asc' } } },
        cacheStrategy: cacheStrategies.public,
      });

      // Warm up basic stats
      await Promise.all([
        prisma.laptop.count({
          where: { published: true },
          cacheStrategy: cacheStrategies.static,
        }),
        prisma.laptop.count({
          cacheStrategy: cacheStrategies.static,
        }),
      ]);

      console.log('Cache warmed successfully');
    } catch (error) {
      console.warn('Cache warming failed:', error);
    }
  }

  /**
   * Warm cache for specific laptop and related data
   */
  static async warmLaptopData(laptopId: number) {
    try {
      await prisma.laptop.findUnique({
        where: { id: laptopId },
        include: { images: { orderBy: { position: 'asc' } } },
        cacheStrategy: cacheStrategies.individualItem,
      });
    } catch (error) {
      console.warn(`Failed to warm cache for laptop ${laptopId}:`, error);
    }
  }
}

/**
 * Cache monitoring and metrics
 */
export class CacheMonitor {
  /**
   * Get cache performance metrics (if available)
   * Note: Actual metrics depend on Prisma Accelerate's monitoring capabilities
   */
  static async getCacheMetrics() {
    // This is a placeholder for cache monitoring
    // Actual implementation would depend on Prisma Accelerate's monitoring API
    return {
      hitRate: 'Not available - depends on Prisma Accelerate monitoring',
      missRate: 'Not available - depends on Prisma Accelerate monitoring',
      averageResponseTime: 'Not available - depends on Prisma Accelerate monitoring',
    };
  }

  /**
   * Log cache strategy usage for debugging
   */
  static logCacheStrategy(operation: string, strategy: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Cache strategy for ${operation}:`, strategy);
    }
  }
}

/**
 * Cache invalidation patterns
 */
export class CacheInvalidator {
  /**
   * Invalidate all laptop-related caches
   * Call this after any laptop modification
   */
  static async invalidateLaptopCaches() {
    // Since Prisma Accelerate doesn't have direct cache invalidation,
    // we rely on TTL expiration and revalidateTag for Next.js cache
    try {
      const { revalidateTag } = await import('next/cache');
      revalidateTag('admin-laptops');
      revalidateTag('published-laptops');
    } catch (error) {
      // Handle case where revalidateTag is not available
      console.warn('Cache invalidation not available:', error);
    }
  }

  /**
   * Invalidate specific laptop cache
   */
  static async invalidateLaptopCache(laptopId: number) {
    try {
      const { revalidateTag } = await import('next/cache');
      revalidateTag(`laptop-${laptopId}`);
    } catch (error) {
      console.warn('Specific cache invalidation not available:', error);
    }
  }
}

/**
 * Usage Examples:
 * 
 * 1. Basic caching:
 *    const laptops = await CacheManager.getLaptopsForUser('public');
 * 
 * 2. Search with fallback:
 *    const results = await CacheManager.searchLaptops('gaming laptop');
 * 
 * 3. Paginated results:
 *    const page = await CacheManager.getPaginatedLaptops(1, 12);
 * 
 * 4. Cache warming (call during app initialization):
 *    await CacheWarmer.warmEssentialData();
 * 
 * 5. Cache invalidation (call after mutations):
 *    await CacheInvalidator.invalidateLaptopCaches();
 */ 