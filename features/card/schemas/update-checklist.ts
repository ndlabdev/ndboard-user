import { z } from 'zod'

// ** Schema
export const cardUpdateChecklistSchema = z.object({
    id: z.string(),
    title: z.string().trim().optional(),
    checklistId: z.string(),
    isShow: z.boolean().optional()
})

// ** Types
export type CardUpdateChecklistFormValues = z.infer<typeof cardUpdateChecklistSchema>
