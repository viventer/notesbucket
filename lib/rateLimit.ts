"use server";

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(50, "30 s"),
});

export async function checkRateLimit(): Promise<boolean> {
  const allHeaders = await headers();
  const ip = allHeaders.get("x-forwarded-for") ?? "anonymous";
  const result = await ratelimit.limit(ip);
  console.log(result.remaining);

  if (!result.success) {
    return false;
  }
  return true;
}
