import { z } from 'zod'

// ** Schema
export const cardAddChecklistItemSchema = z.object({
    id: z.string(),
    name: z.string().trim().min(1, 'Name is required'),
    checklistId: z.string(),
    order: z.number().optional()
})

// ** Types
export type CardAddChecklistItemFormValues = z.infer<typeof cardAddChecklistItemSchema>
