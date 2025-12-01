import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter that allows 10 requests per 10 seconds
// For development without Upstash, we use an in-memory store
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : undefined;

// In-memory fallback for development
class MemoryStore {
  private store = new Map<string, { count: number; reset: number }>();

  async limit(identifier: string, limit: number, window: number) {
    const now = Date.now();
    const key = identifier;
    const data = this.store.get(key);

    if (!data || now > data.reset) {
      this.store.set(key, { count: 1, reset: now + window });
      return { success: true, limit, remaining: limit - 1, reset: now + window };
    }

    if (data.count >= limit) {
      return { success: false, limit, remaining: 0, reset: data.reset };
    }

    data.count++;
    this.store.set(key, data);
    return { success: true, limit, remaining: limit - data.count, reset: data.reset };
  }
}

const memoryStore = new MemoryStore();

// Create rate limiters for different use cases
export const apiRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
    })
  : {
      limit: async (identifier: string) => memoryStore.limit(identifier, 10, 10000),
    };

export const authRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      analytics: true,
    })
  : {
      limit: async (identifier: string) => memoryStore.limit(identifier, 5, 60000),
    };

export const commentRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "60 s"),
      analytics: true,
    })
  : {
      limit: async (identifier: string) => memoryStore.limit(identifier, 3, 60000),
    };

// Helper function to get identifier from request
export function getIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1";
  return ip;
}
