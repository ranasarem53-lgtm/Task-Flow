import { prisma } from '../../lib/prisma'
import { HttpError } from '../../middleware/http-error'
import { serializeTask, type SerializedTask } from './task.serializer'

type CreateInput = {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: string | null
}

type UpdateInput = Partial<CreateInput> & {
  status?: 'pending' | 'completed'
}

// Every method is scoped by userId — tasks are never visible or
// modifiable across users, even if a valid token from another
// account is used.

export const taskService = {
  async listTasks(userId: string): Promise<SerializedTask[]> {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return tasks.map(serializeTask)
  },

  async getTask(userId: string, taskId: string): Promise<SerializedTask> {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    })
    if (!task) {
      throw new HttpError(404, 'Task not found')
    }
    return serializeTask(task)
  },

  async createTask(userId: string, input: CreateInput): Promise<SerializedTask> {
    const task = await prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        priority: input.priority,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        // Ownership is set server-side from the authenticated user,
        // never from the request body.
        userId,
      },
    })
    return serializeTask(task)
  },

  async updateTask(
    userId: string,
    taskId: string,
    input: UpdateInput,
  ): Promise<SerializedTask> {
    // Ownership check happens in the same query used for the update.
    const existing = await prisma.task.findFirst({
      where: { id: taskId, userId },
      select: { id: true },
    })
    if (!existing) {
      throw new HttpError(404, 'Task not found')
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.priority !== undefined ? { priority: input.priority } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.dueDate !== undefined
          ? { dueDate: input.dueDate ? new Date(input.dueDate) : null }
          : {}),
      },
    })
    return serializeTask(task)
  },

  async deleteTask(userId: string, taskId: string): Promise<void> {
    // deleteMany with userId is atomic and ownership-safe:
    // it deletes nothing if the task belongs to someone else.
    const result = await prisma.task.deleteMany({
      where: { id: taskId, userId },
    })
    if (result.count === 0) {
      throw new HttpError(404, 'Task not found')
    }
  },

  async toggleCompletion(
    userId: string,
    taskId: string,
  ): Promise<SerializedTask> {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    })
    if (!task) {
      throw new HttpError(404, 'Task not found')
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { status: task.status === 'completed' ? 'pending' : 'completed' },
    })
    return serializeTask(updated)
  },
}
