import { InfoMatchType } from "@prisma/client";
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

export const InfoValidator = z.object({
    type: z.enum([InfoMatchType.BUT,InfoMatchType.CARTON_JAUNE, InfoMatchType.CARTON_ROUGE]),
    minute: z.number(),
    equipeId: z.string(),
    playerId: z.string(),
    matchId : z.string()
})

export type InfoPayload = z.infer<typeof InfoValidator>
 