import { apiClient } from '../../../shared/api/api-client'
import type {
  Task,
  TaskCreateInput,
  TaskUpdateInput,
} from '../types/task-types'

const TASKS_ENDPOINT = '/tasks'

export const taskService = {
  // GET /api/tasks -> SerializedTask[]
  async getTasks(): Promise<Task[]> {
    return apiClient<Task[]>(TASKS_ENDPOINT)
  },

  // POST /api/tasks -> 201 SerializedTask
  async createTask(input: TaskCreateInput): Promise<Task> {
    return apiClient<Task>(TASKS_ENDPOINT, {
      method: 'POST',
      body: {
        title: input.title,
        description: input.description,
        priority: input.priority,
        // Backend expects null when there is no due date.
        dueDate: input.dueDate ? input.dueDate : null,
      },
    })
  },

  // PATCH /api/tasks/:id -> 200 SerializedTask
  // The backend validator accepts a parseable date string or null for
  // dueDate — an empty string (cleared field) must be sent as null.
  async updateTask(id: string, input: TaskUpdateInput): Promise<Task> {
    return apiClient<Task>(`${TASKS_ENDPOINT}/${id}`, {
      method: 'PATCH',
      body: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.priority !== undefined ? { priority: input.priority } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.dueDate !== undefined ? { dueDate: input.dueDate || null } : {}),
      },
    })
  },

  // DELETE /api/tasks/:id -> 204
  async deleteTask(id: string): Promise<void> {
    await apiClient<void>(`${TASKS_ENDPOINT}/${id}`, { method: 'DELETE' })
  },

  // PATCH /api/tasks/:id/toggle flips pending <-> completed server-side.
  async toggleTaskCompletion(id: string, _status: Task['status']): Promise<Task> {
    return apiClient<Task>(`${TASKS_ENDPOINT}/${id}/toggle`, { method: 'PATCH' })
  },
}
