import { z } from "zod";

export const accessTokenPayloadSchema = z.object({
  userId: z.uuid(),
});

export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;
