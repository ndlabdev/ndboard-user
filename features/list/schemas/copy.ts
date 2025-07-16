import { z } from 'zod'

// ** Schema
export const listCopySchema = z.object({
    id: z.string(),
    name: z.string()
        .trim()
        .nonempty('List name cannot be empty')
        .min(1, 'List name cannot be empty')
        .max(100, 'List name must be at most 100 characters')
})

// ** Types
export type ListCopyFormValues = z.infer<typeof listCopySchema>
