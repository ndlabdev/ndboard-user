import { z } from 'zod'

// ** Schema
export const cardCreateSchema = z.object({
    name: z.string().optional(),
    listId: z.string(),
    startDate: z.string().datetime().nullable().optional(),
    dueDate: z.string().datetime().nullable().optional(),
    index: z.number().optional()
})

// ** State
export const cardCreateState: z.infer<typeof cardCreateSchema> = {
    name: '',
    listId: ''
}

// ** Types
export type CardCreateFormValues = z.infer<typeof cardCreateSchema>
