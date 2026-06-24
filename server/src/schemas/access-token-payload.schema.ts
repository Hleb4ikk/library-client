import { z } from "zod";

export const accessTokenPayloadSchema = z.object({
  userId: z.number(),
});

export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;
