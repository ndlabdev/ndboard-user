import { z } from 'zod'

// ** Schema
export const listReorderSchema = z.object({
    lists: z.array(
        z.object({
            id: z.string(),
            order: z.number()
        })
    ),
    boardId: z.string()
})

// ** State
export const listReorderState: z.infer<typeof listReorderSchema> = {
    lists: [],
    boardId: ''
}

// ** Types
export type ListReorderFormValues = z.infer<typeof listReorderSchema>
