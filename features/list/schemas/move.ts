import { z } from 'zod'

// ** Schema
export const listMoveSchema = z.object({
    id: z.string(),
    boardId: z.string()
})

// ** Types
export type ListMoveFormValues = z.infer<typeof listMoveSchema>
