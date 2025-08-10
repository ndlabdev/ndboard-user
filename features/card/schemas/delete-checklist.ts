import { z } from 'zod'

// ** Schema
export const deleteAddChecklistSchema = z.object({
    id: z.string(),
    checklistId: z.string()
})

// ** Types
export type CardDeleteChecklistFormValues = z.infer<typeof deleteAddChecklistSchema>
