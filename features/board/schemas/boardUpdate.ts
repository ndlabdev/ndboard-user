import { z } from 'zod'
import { BOARD_VISIBILITY } from '@/features/board'

const BOARD_VISIBILITY_VALUES = Object.values(BOARD_VISIBILITY) as [string, ...string[]]

// ** Schema
export const boardUpdateSchema = z.object({
    shortLink: z.string(),
    name: z.string().optional(),
    visibility: z.enum(BOARD_VISIBILITY_VALUES).optional()
})

// ** Types
export type BoardUpdateFormValues = z.infer<typeof boardUpdateSchema>
