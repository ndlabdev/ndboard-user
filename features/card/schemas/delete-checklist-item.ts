import { z } from 'zod'

// ** Schema
export const deleteAddChecklistItemSchema = z.object({
    id: z.string(),
    itemId: z.string(),
    checklistId: z.string()
})

// ** Types
export type CardDeleteChecklistItemFormValues = z.infer<typeof deleteAddChecklistItemSchema>
