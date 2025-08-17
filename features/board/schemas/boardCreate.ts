import { z } from 'zod'
import { BOARD_VISIBILITY, DEFAULT_BOARD_BACKGROUNDS } from '@/features/board'

const BOARD_VISIBILITY_VALUES = Object.values(BOARD_VISIBILITY) as [string, ...string[]]

// ** Schema
export const boardCreateSchema = z.object({
    name: z.string()
        .trim()
        .nonempty('Name cannot be empty')
        .min(1, 'Name cannot be empty')
        .max(100, 'Name must be at most 100 characters'),
    description: z.string().optional(),
    coverImageUrl: z.string().optional(),
    workspaceId: z.string(),
    visibility: z.enum(BOARD_VISIBILITY_VALUES)

})

// ** State
export const boardCreateState: z.infer<typeof boardCreateSchema> = {
    name: '',
    description: '',
    coverImageUrl: DEFAULT_BOARD_BACKGROUNDS[0].fullUrl,
    workspaceId: '',
    visibility: BOARD_VISIBILITY.PRIVATE
}

// ** Types
export type BoardCreateFormValues = z.infer<typeof boardCreateSchema>
