import { z } from 'zod'

// ** Schema
export const boardFavoriteSchema = z.object({
    shortLink: z.string()
})

// ** Types
export type BoardFavoriteFormValues = z.infer<typeof boardFavoriteSchema>
