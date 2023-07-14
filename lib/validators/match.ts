import { z } from "zod";

export const UpdateMatchValidator = z.object({
    matchId: z.string(),
    terrain: z.string(),
    date: z.string(),
    assistantId: z.string(),
    arbitreId: z.string(),
    time: z.string()
}) 

export type UpdateMatchPayload = z.infer<typeof UpdateMatchValidator>