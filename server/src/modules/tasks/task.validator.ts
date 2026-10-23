import { z } from 'zod'

// Matches the frontend's TaskPriority / TaskStatus unions exactly.
const prioritySchema = z.enum(['low', 'medium', 'high'])
const statusSchema = z.enum(['pending', 'completed'])

// Optional ISO date string; must parse as a real date when present.
const dueDateSchema = z
  .string()
  .refine(
    (value) => !Number.isNaN(new Date(value).getTime()),
    'dueDate must be a valid date string',
  )
  .nullable()
  .optional()

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim().optional().default(''),
    priority: prioritySchema.optional().default('medium'),
    dueDate: dueDateSchema,
  }),
})

export const updateTaskSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(1, 'Title is required').optional(),
      description: z.string().trim().optional(),
      priority: prioritySchema.optional(),
      status: statusSchema.optional(),
      dueDate: dueDateSchema,
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: 'At least one field must be provided',
    }),
})

export const taskIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Task id must be a valid uuid'),
  }),
})
