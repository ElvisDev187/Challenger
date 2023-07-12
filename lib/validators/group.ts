import { z } from "zod"

export const displayFormSchema = z.object({
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
})

export type DisplayFormValues = z.infer<typeof displayFormSchema>

export const groupValidator = z.object({
    tournoiId: z.string(),
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
})
export type GroupPayload = z.infer<typeof groupValidator>