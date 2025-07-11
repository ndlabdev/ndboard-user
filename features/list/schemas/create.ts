import { z } from 'zod'

// ** Schema
export const listCreateSchema = z.object({
    name: z.string().optional(),
    boardId: z.string()
})

// ** State
export const listCreateState: z.infer<typeof listCreateSchema> = {
    name: '',
    boardId: ''
}

// ** Types
export type ListCreateFormValues = z.infer<typeof listCreateSchema>
