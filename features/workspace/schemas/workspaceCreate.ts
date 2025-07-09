import { z } from 'zod'
import { BOARD_VISIBILITY } from '@/features/workspace'

const BOARD_VISIBILITY_VALUES = Object.values(BOARD_VISIBILITY) as [string, ...string[]]

// ** Schema
export const workspaceCreateSchema = z.object({
    name: z.string()
        .trim()
        .nonempty('Workspace name cannot be empty')
        .min(1, 'Workspace name cannot be empty')
        .max(100, 'Workspace name must be at most 100 characters'),
    description: z.string().optional(),
    coverImageUrl: z.string().optional(),
    visibility: z.enum(BOARD_VISIBILITY_VALUES)
})

// ** State
export const workspaceCreateState: z.infer<typeof workspaceCreateSchema> = {
    name: '',
    description: '',
    coverImageUrl: '',
    visibility: BOARD_VISIBILITY.PRIVATE
}

// ** Types
export type WorkspaceCreateFormValues = z.infer<typeof workspaceCreateSchema>
