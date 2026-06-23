import { appConfig } from "@/appConfig.js";
import KeyvRedis from "@keyv/redis";

export const cache = new KeyvRedis(appConfig.redisUrl);
