import { z } from "zod";
const Rolev = z.enum(["ARBITRE", "ASSISTANT"])
export const StaffValidator = z.object({
    name: z.string(),
    email: z.string(),
    tournoiId: z.string(),
    role: z.string()
})

export type StaffPayload = z.infer<typeof StaffValidator>
export type Role = z.infer<typeof Rolev>