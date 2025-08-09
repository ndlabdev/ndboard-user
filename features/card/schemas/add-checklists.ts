import { z } from 'zod'

// ** Schema
export const cardAddChecklistsSchema = z.object({
    id: z.string(),
    title: z.string().trim().min(1, 'Title is required'),
    order: z.number().optional()
})

// ** Types
export type CardAddChecklistsFormValues = z.infer<typeof cardAddChecklistsSchema>
