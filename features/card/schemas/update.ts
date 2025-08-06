import { z } from 'zod'

// ** Schema
export const cardUpdateSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    labels: z.array(z.string()).optional()
})

// ** State
export const cardUpdateState: z.infer<typeof cardUpdateSchema> = {
    id: '',
    name: '',
    labels: []
}

// ** Types
export type CardUpdateFormValues = z.infer<typeof cardUpdateSchema>
