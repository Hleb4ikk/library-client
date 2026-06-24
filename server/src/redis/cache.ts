import { appConfig } from "@/appConfig.js";
import Keyv from "keyv";
import KeyvRedis from "@keyv/redis";

const store = new KeyvRedis(appConfig.redisUrl);

export const cache = new Keyv({
  store,
  namespace: "openlibrary",
  ttl: appConfig.cacheTTL,
});

cache.on("error", (err) => {
  console.error("[cache] Redis error:", err);
});

export async function getOrSet<T>(
  key: string,
  fn: () => Promise<T>,
): Promise<T> {
  try {
    const cached = await cache.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }
  } catch (err) {
    console.error("[cache] get failed, falling back to source:", err);
  }

  const fresh = await fn();

  try {
    await cache.set(key, fresh);
  } catch (err) {
    console.error("[cache] set failed:", err);
  }

  return fresh;
}
