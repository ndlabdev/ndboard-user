import { z } from 'zod'
import { LABEL_COLOR_NAMES, LABEL_TONES } from '@/features/board'

// ** Schema
export const boardLabelCreateSchema = z.object({
    name: z.string().optional(),
    color: z.enum(LABEL_COLOR_NAMES, { message: 'Invalid color' }),
    tone: z.enum(LABEL_TONES, { message: 'Invalid tone' }),
    boardId: z.string()
})

// ** State
export const boardLabelCreateState: z.infer<typeof boardLabelCreateSchema> = {
    name: '',
    color: 'green',
    tone: 'normal',
    boardId: ''
}

// ** Types
export type BoardLabelCreateFormValues = z.infer<typeof boardLabelCreateSchema>
