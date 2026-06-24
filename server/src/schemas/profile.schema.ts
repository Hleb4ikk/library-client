import z from "zod";

export const changeLoginBodySchema = z.object({
    new_username: z.string().min(3)
});