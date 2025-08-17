import { z } from 'zod'

// ** Schema
export const cardUpdateSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    description: z.any().optional(),
    labels: z.array(z.string()).optional(),
    assignees: z.array(z.string()).optional()
})

// ** State
export const cardUpdateState: z.infer<typeof cardUpdateSchema> = {
    id: '',
    name: '',
    labels: [],
    assignees: []
}

// ** Types
export type CardUpdateFormValues = z.infer<typeof cardUpdateSchema>
