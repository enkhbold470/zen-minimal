/**
 * Prisma Accelerate Cache Strategies
 * 
 * This file defines different caching strategies for various query types
 * to optimize performance with Prisma Accelerate's global caching layer.
 */

export const cacheStrategies = {
  // Short-lived cache for frequently changing admin data
  admin: {
    swr: 30,   // Stale-while-revalidate: 30 seconds
    ttl: 60,   // Time-to-live: 1 minute
  },

  // Medium cache for admin listings that change less frequently
  adminListing: {
    swr: 60,   // Stale-while-revalidate: 1 minute
    ttl: 300,  // Time-to-live: 5 minutes
  },

  // Longer cache for public data that users see
  public: {
    swr: 300,  // Stale-while-revalidate: 5 minutes
    ttl: 600,  // Time-to-live: 10 minutes
  },

  // Aggressive cache for individual items that rarely change
  individualItem: {
    swr: 300,  // Stale-while-revalidate: 5 minutes
    ttl: 900,  // Time-to-live: 15 minutes
  },

  // Long-term cache for static or rarely changing data
  static: {
    swr: 600,  // Stale-while-revalidate: 10 minutes
    ttl: 1800, // Time-to-live: 30 minutes
  },

  // Real-time cache for critical data that must be fresh
  realtime: {
    swr: 10,   // Stale-while-revalidate: 10 seconds
    ttl: 30,   // Time-to-live: 30 seconds
  },
} as const;

/**
 * Cache Tags for organized cache invalidation
 * Use these tags to group related queries for batch invalidation
 */
export const cacheTags = {
  laptops: 'laptops',
  laptop: (id: number) => `laptop:${id}`,
  images: 'images',
  stats: 'stats',
  published: 'published',
  admin: 'admin',
} as const;

/**
 * Helper function to create cache strategy with custom TTL
 */
export function createCacheStrategy(ttl: number, swr?: number) {
  return {
    swr: swr || Math.floor(ttl * 0.5), // Default SWR to 50% of TTL
    ttl,
  };
}

/**
 * Cache strategy recommendations based on query type:
 * 
 * 1. **Admin queries**: Use `admin` or `adminListing` strategies
 *    - Data changes frequently due to admin actions
 *    - Short cache times prevent stale admin interfaces
 * 
 * 2. **Public queries**: Use `public` or `static` strategies
 *    - Data changes less frequently
 *    - Longer cache times improve user experience
 * 
 * 3. **Individual items**: Use `individualItem` strategy
 *    - Product details, user profiles, etc.
 *    - Medium-long cache since individual items change infrequently
 * 
 * 4. **Real-time data**: Use `realtime` strategy
 *    - Live stats, notifications, activity feeds
 *    - Very short cache for near real-time updates
 * 
 * 5. **Static data**: Use `static` strategy
 *    - Configuration, categories, rarely changing reference data
 *    - Long cache times for data that almost never changes
 */ 