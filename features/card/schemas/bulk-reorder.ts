import { z } from 'zod'

// ** Schema
export const cardBulkReorderSchema = z.object({
    lists: z.array(
        z.object({
            listId: z.string().min(1, 'List ID is required'),
            cards: z.array(
                z.object({
                    id: z.string().min(1, 'Card ID is required'),
                    order: z.number().int('Order must be integer').gte(0, 'Order must be non-negative')
                })
            ).min(1, 'Each list must have at least one card')
        })
    ).min(1, 'At least one list is required')
})

// ** Types
export type CardBulkReorderFormValues = z.infer<typeof cardBulkReorderSchema>
