import { z } from 'zod'

// ** Schema
export const cardReorderSchema = z.object({
    id: z.string(),
    listId: z.string(),
    order: z.number()
})

// ** Types
export type CardReorderFormValues = z.infer<typeof cardReorderSchema>
