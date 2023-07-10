import { z } from "zod";
import  { PosteFootball } from "@prisma/client"

export const PlayerValidator = z.object({
    name : z.string(),
    age     : z.number(),
    poste     : z.enum([PosteFootball.ATTAQUANT,PosteFootball.DEFENSEUR,PosteFootball.GARDIEN_DE_BUT,PosteFootball.MILIEU_DE_TERRAIN])
})
export const TeamValidator = z.object({
    name : z.string(),
    tournoiId  : z.string(),
    palyer: z.array(PlayerValidator)
})

export type TeamPayload = z.infer<typeof TeamValidator>
export type PlayerPayload = z.infer<typeof PlayerValidator>