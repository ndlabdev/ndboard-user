import { z } from 'zod'

// ** Schema
export const listMoveAllCardsSchema = z.object({
    id: z.string(),
    targetListId: z
        .string()
        .trim()
        .nonempty('List cannot be empty')
})

// ** Types
export type ListMoveAllCardsFormValues = z.infer<typeof listMoveAllCardsSchema>
