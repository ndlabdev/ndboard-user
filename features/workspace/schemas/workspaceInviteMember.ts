import { z } from 'zod'

// ** Schema
export const workspaceInviteMemberSchema = z.object({
    userIds: z.array(z.string())
})

// ** Types
export type WorkspaceInviteMemberFormValues = z.infer<typeof workspaceInviteMemberSchema>
