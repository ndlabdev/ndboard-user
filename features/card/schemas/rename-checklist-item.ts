import { z } from 'zod'

// ** Schema
export const renameChecklistItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    itemId: z.string(),
    checklistId: z.string()
})

// ** Types
export type CardRenameChecklistItemFormValues = z.infer<typeof renameChecklistItemSchema>
