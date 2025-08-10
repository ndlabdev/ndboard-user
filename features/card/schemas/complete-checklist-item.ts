import { z } from 'zod'

// ** Schema
export const completeChecklistItemSchema = z.object({
    id: z.string(),
    completed: z.boolean(),
    itemId: z.string(),
    checklistId: z.string()
})

// ** Types
export type CardCompleteChecklistItemFormValues = z.infer<typeof completeChecklistItemSchema>
