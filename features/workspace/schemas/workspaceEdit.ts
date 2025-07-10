import { z } from 'zod'

// ** Schema
export const workspaceEditSchema = z.object({
    id: z.string(),
    name: z.string()
        .trim()
        .nonempty('Workspace name cannot be empty')
        .min(1, 'Workspace name cannot be empty')
        .max(100, 'Workspace name must be at most 100 characters'),
    slug: z.string()
        .trim()
        .nonempty('Workspace URL cannot be empty')
        .min(1, 'Workspace URL cannot be empty')
        .max(120, 'Workspace URL must be at most 120 characters'),
    description: z.string().optional()
})

// ** Types
export type WorkspaceEditFormValues = z.infer<typeof workspaceEditSchema>
