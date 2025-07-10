import { z } from 'zod'

// ** Schema
export const workspaceCreateSchema = z.object({
    name: z.string()
        .trim()
        .nonempty('Workspace name cannot be empty')
        .min(1, 'Workspace name cannot be empty')
        .max(100, 'Workspace name must be at most 100 characters'),
    description: z.string().optional()
})

// ** State
export const workspaceCreateState: z.infer<typeof workspaceCreateSchema> = {
    name: '',
    description: ''
}

// ** Types
export type WorkspaceCreateFormValues = z.infer<typeof workspaceCreateSchema>
