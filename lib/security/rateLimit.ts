type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const rateLimitBuckets = new Map<string, RateLimitBucket>();

function pruneExpiredBuckets(now: number) {
  for (const [key, bucket] of rateLimitBuckets.entries()) {
    if (bucket.resetAt <= now) {
      rateLimitBuckets.delete(key);
    }
  }
}

export function takeRateLimit({
  key,
  limit,
  windowMs,
  now = Date.now(),
}: {
  key: string;
  limit: number;
  windowMs: number;
  now?: number;
}) {
  pruneExpiredBuckets(now);

  const existingBucket = rateLimitBuckets.get(key);

  if (!existingBucket || existingBucket.resetAt <= now) {
    const nextBucket = {
      count: 1,
      resetAt: now + windowMs,
    };

    rateLimitBuckets.set(key, nextBucket);

    return {
      allowed: true,
      remaining: Math.max(0, limit - nextBucket.count),
      resetAt: nextBucket.resetAt,
    };
  }

  existingBucket.count += 1;
  rateLimitBuckets.set(key, existingBucket);

  return {
    allowed: existingBucket.count <= limit,
    remaining: Math.max(0, limit - existingBucket.count),
    resetAt: existingBucket.resetAt,
  };
}

