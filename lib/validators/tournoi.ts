import { z } from "zod";

export const TournoiValidator = z.object({
 name : z.string(),
 description  : z.string(),
 lieu : z.string(),
 ageMax : z.number(),
 isFree : z.boolean(),
 debut : z.string(),
 inscriptionLimit : z.string(),
 cover : z.string(),
 limit : z.number().optional()

})

export type TournoiRequest = z.infer<typeof TournoiValidator>