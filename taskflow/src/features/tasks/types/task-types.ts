export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'pending' | 'completed'

export type Task = {
  id: string
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: string | null
  createdAt: string
}

export type TaskCreateInput = Pick<
  Task,
  'title' | 'description' | 'priority' | 'dueDate'
>

export type TaskUpdateInput = Partial<TaskCreateInput> & {
  status?: TaskStatus
}

export type TaskStatusFilter = 'all' | TaskStatus
