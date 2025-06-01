# Prisma Accelerate Caching Guide

This guide explains how to effectively use Prisma Accelerate's global caching layer to boost your application's performance with scalable connection pooling and intelligent database caching.

## Overview

Prisma Accelerate provides:

- **Global Connection Pool**: 15+ regions with automatic scaling for serverless deployments
- **Global Cache**: 300+ edge locations for reduced latency worldwide
- **Query-level Caching**: Configure cache policies directly in your Prisma queries
- **Stale-While-Revalidate (SWR)**: Serve cached data while fetching fresh data in the background

## Setup

Your application is already configured with Prisma Accelerate. The setup includes:

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"

const createPrismaClient = () => new PrismaClient().$extends(withAccelerate())
```

## Cache Strategies

We use different cache strategies based on data characteristics:

### 1. Admin Data (`cacheStrategies.admin`)

- **SWR**: 30 seconds
- **TTL**: 60 seconds
- **Use for**: Real-time admin stats, frequently changing data

### 2. Admin Listings (`cacheStrategies.adminListing`)

- **SWR**: 60 seconds
- **TTL**: 5 minutes
- **Use for**: Admin dashboards, data that changes moderately

### 3. Public Data (`cacheStrategies.public`)

- **SWR**: 5 minutes
- **TTL**: 10 minutes
- **Use for**: Public-facing content, published laptops

### 4. Individual Items (`cacheStrategies.individualItem`)

- **SWR**: 5 minutes
- **TTL**: 15 minutes
- **Use for**: Product details, individual laptop pages

### 5. Static Data (`cacheStrategies.static`)

- **SWR**: 10 minutes
- **TTL**: 30 minutes
- **Use for**: Counts, categories, rarely changing reference data

## Usage Examples

### Basic Query with Caching

```typescript
import { cacheStrategies } from "@/lib/cache-strategies"

// Cache published laptops for public display
const laptops = await prisma.laptop.findMany({
  where: { published: true },
  include: { images: true },
  cacheStrategy: cacheStrategies.public,
})
```

### Advanced Caching Patterns

```typescript
import { CacheManager } from "@/lib/cache-utils"

// Intelligent user-based caching
const laptops = await CacheManager.getLaptopsForUser("public")

// Search with automatic fallback
const results = await CacheManager.searchLaptops("gaming laptop")

// Paginated results with optimized caching
const page = await CacheManager.getPaginatedLaptops(1, 12)
```

### Cache Warming

```typescript
import { CacheWarmer } from "@/lib/cache-utils"

// Warm essential data on app startup
await CacheWarmer.warmEssentialData()

// Warm specific laptop data
await CacheWarmer.warmLaptopData(laptopId)
```

## Environment-Aware Caching

The system automatically adjusts caching based on environment:

- **Development**: Caching disabled for immediate data updates
- **Staging/Preview**: Reduced cache times (50% of production)
- **Production**: Full cache times for optimal performance

## Cache Invalidation

Since Prisma Accelerate uses TTL-based expiration, we combine it with Next.js cache tags:

```typescript
import { CacheInvalidator } from "@/lib/cache-utils"

// After creating/updating laptops
await CacheInvalidator.invalidateLaptopCaches()

// After updating specific laptop
await CacheInvalidator.invalidateLaptopCache(laptopId)
```

## Performance Benefits

### Connection Pooling

- **Serverless-optimized**: Prevents connection exhaustion in serverless functions
- **Global scaling**: Automatic scaling across 15+ regions
- **Reduced latency**: Connection reuse reduces database connection overhead

### Global Caching

- **Edge distribution**: 300+ locations worldwide
- **Reduced database load**: Frequently accessed data served from cache
- **Improved response times**: Sub-100ms response times for cached queries

### SWR Strategy

- **Always fast**: Serve cached data immediately
- **Always fresh**: Update cache in background
- **Graceful degradation**: Fallback to database if cache fails

## Monitoring and Optimization

### Cache Hit Rates

Monitor your cache performance through Prisma Accelerate dashboard:

- Aim for >80% cache hit rate for public data
- Monitor cache miss patterns to optimize strategies

### Query Optimization

- Use `include` strategically to cache related data
- Consider `select` for large objects to reduce cache size
- Use pagination to limit cache payload size

## Best Practices

### 1. Choose Appropriate Cache Strategies

```typescript
// ✅ Good: Different strategies for different data types
const adminStats = await prisma.laptop.count({
  cacheStrategy: cacheStrategies.admin, // Short cache for admin data
})

const publicLaptops = await prisma.laptop.findMany({
  where: { published: true },
  cacheStrategy: cacheStrategies.public, // Longer cache for public data
})
```

### 2. Cache Related Data Together

```typescript
// ✅ Good: Include related data to reduce additional queries
const laptop = await prisma.laptop.findUnique({
  where: { id },
  include: { images: { orderBy: { position: "asc" } } },
  cacheStrategy: cacheStrategies.individualItem,
})
```

### 3. Use Conditional Caching

```typescript
// ✅ Good: Adjust caching based on conditions
const strategy =
  userType === "admin" ? cacheStrategies.adminListing : cacheStrategies.public

const laptops = await prisma.laptop.findMany({
  where: userType === "public" ? { published: true } : undefined,
  cacheStrategy: strategy,
})
```

### 4. Implement Cache Warming

```typescript
// ✅ Good: Pre-populate cache with essential data
export async function warmCache() {
  await CacheWarmer.warmEssentialData()
}
```

## Common Patterns

### Search Results

```typescript
export async function searchLaptops(query: string) {
  return await prisma.laptop.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
      published: true,
    },
    cacheStrategy: cacheStrategies.public,
  })
}
```

### Dashboard Stats

```typescript
export async function getDashboardStats() {
  const [total, published] = await Promise.all([
    prisma.laptop.count({
      cacheStrategy: cacheStrategies.admin,
    }),
    prisma.laptop.count({
      where: { published: true },
      cacheStrategy: cacheStrategies.admin,
    }),
  ])

  return { total, published }
}
```

### Paginated Lists

```typescript
export async function getPaginatedLaptops(page: number, pageSize: number) {
  const skip = (page - 1) * pageSize

  return await prisma.laptop.findMany({
    where: { published: true },
    skip,
    take: pageSize,
    cacheStrategy:
      page === 1
        ? cacheStrategies.public // First page cached longer
        : cacheStrategies.adminListing,
  })
}
```

## Troubleshooting

### Cache Not Working

1. Check your DATABASE_URL includes Accelerate endpoint
2. Verify `withAccelerate()` extension is properly configured
3. Ensure cache strategy is not undefined in development

### Stale Data Issues

1. Reduce TTL for frequently changing data
2. Implement proper cache invalidation
3. Use shorter SWR values for critical data

### Performance Issues

1. Monitor cache hit rates
2. Optimize query structure to reduce payload size
3. Consider cache warming for critical paths

## Migration from Next.js Cache

If migrating from `unstable_cache`, replace:

```typescript
// ❌ Old: Next.js unstable_cache
export const getLaptops = unstable_cache(
  async () => {
    return await prisma.laptop.findMany()
  },
  ["laptops"],
  { tags: ["laptops"] }
)

// ✅ New: Prisma Accelerate caching
export async function getLaptops() {
  return await prisma.laptop.findMany({
    cacheStrategy: cacheStrategies.public,
  })
}
```

## Additional Resources

- [Prisma Accelerate Documentation](https://www.prisma.io/docs/accelerate)
- [Cache Strategy Examples](https://www.prisma.io/docs/accelerate/caching)
- [Connection Pooling Guide](https://www.prisma.io/docs/accelerate/connection-pooling)
