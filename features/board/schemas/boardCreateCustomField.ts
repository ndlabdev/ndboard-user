import { z } from 'zod'

// ** Schema
export const boardCustomFieldOptionSchema = z.object({
    id: z.string(),
    label: z.string().min(1, 'Option label required'),
    color: z.string()
})

export const boardCreateCustomFieldSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Field name is required'),
    type: z.enum(['text', 'number', 'date', 'checkbox', 'select']),
    showOnCard: z.boolean(),
    options: z.array(boardCustomFieldOptionSchema).optional()
})

// ** State
export const boardCreateCustomFieldState: z.infer<typeof boardCreateCustomFieldSchema> = {
    name: '',
    type: 'text',
    showOnCard: false,
    options: []
}

// ** Types
export type BoardCreateCustomFieldFormValues = z.infer<typeof boardCreateCustomFieldSchema>
