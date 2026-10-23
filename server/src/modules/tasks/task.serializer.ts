import type { Priority, Status, Task } from '@prisma/client'

// Serialized shape matches the frontend `Task` type exactly
// (taskflow/src/features/tasks/types/task-types.ts).
export type SerializedTask = {
  id: string
  title: string
  description: string
  priority: Priority
  status: Status
  dueDate: string
  createdAt: string
}

export function serializeTask(task: Task): SerializedTask {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    // Prisma returns null for missing dates; frontend expects a string.
    dueDate: task.dueDate ? task.dueDate.toISOString() : '',
    createdAt: task.createdAt.toISOString(),
  }
}

export function serializeTasks(tasks: Task[]): SerializedTask[] {
  return tasks.map(serializeTask)
}
