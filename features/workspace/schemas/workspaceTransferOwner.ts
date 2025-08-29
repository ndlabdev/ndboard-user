import { z } from 'zod'

// ** Schema
export const workspaceTransferOwnerSchema = z.object({
    workspaceId: z.string().min(1, 'Workspace ID is required'),
    newOwnerId: z.string().min(1, 'New owner ID is required')
})

// ** Types
export type WorkspaceTransferOwnerFormValues = z.infer<typeof workspaceTransferOwnerSchema>
