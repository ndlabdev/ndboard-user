import { z } from 'zod'

// ** Schema
export const boardUpdateSchema = z.object({
    shortLink: z.string(),
    name: z.string().optional()
})

// ** Types
export type BoardUpdateFormValues = z.infer<typeof boardUpdateSchema>
