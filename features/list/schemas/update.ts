import { z } from 'zod'

// ** Schema
export const listUpdateSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    isFold: z.boolean().optional()
})

// ** State
export const listUpdateState: z.infer<typeof listUpdateSchema> = {
    id: '',
    name: '',
    isFold: false
}

// ** Types
export type ListUpdateFormValues = z.infer<typeof listUpdateSchema>
