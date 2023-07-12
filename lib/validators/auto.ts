import { z } from "zod";

export const AutoActionValidator= z.object({
    tournoiId: z.string(),
})

export type AutoAction = z.infer<typeof AutoActionValidator>