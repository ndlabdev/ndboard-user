import { z } from 'zod'

// ** Schema
export const cardAddCommentSchema = z.object({
    content: z.string().trim().min(1, 'Content is required')
})

// ** Types
export type CardAddCommentFormValues = z.infer<typeof cardAddCommentSchema>
