import sharp from "sharp";
import { encode } from "blurhash";
import axios from "axios";
import { getOrSet } from "@/redis/cache.js";
import { generateCacheKey } from "@/utils/cache.utils.js";

const BLURHASH_SIZE = 32;
const BLURHASH_COMPONENT_X = 4;
const BLURHASH_COMPONENT_Y = 4;

export async function generateBlurhash(imageInput: Buffer | string): Promise<string> {
  const { data, info } = await sharp(imageInput)
    .raw()
    .ensureAlpha()
    .resize(BLURHASH_SIZE, BLURHASH_SIZE, { fit: "inside" })
    .toBuffer({ resolveWithObject: true });

  return encode(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
    BLURHASH_COMPONENT_X,
    BLURHASH_COMPONENT_Y,
  );
}

export async function getCoverBlurhash(coverUrl: string | null): Promise<string | null> {
  if (!coverUrl) {
    return null;
  }

  const cacheKey = generateCacheKey("books:blurhash", { coverUrl });

  return getOrSet<string | null>(cacheKey, async () => {
    try {
      const response = await axios.get<ArrayBuffer>(coverUrl, {
        responseType: "arraybuffer",
      });
      const imageBuffer = Buffer.from(response.data);
      return await generateBlurhash(imageBuffer);
    } catch (error) {
      console.error(`[books] Не удалось сгенерировать blurhash для ${coverUrl}:`, error);
      return null;
    }
  });
}
