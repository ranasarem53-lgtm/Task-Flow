import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../shared/api/api-client'
import { taskService } from '../services/task-service'
import type { Task } from '../types/task-types'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await taskService.getTasks()
      setTasks(data)
    } catch (err) {
      // Prefer the server's message when available (e.g. 401/403 reasons).
      setError(
        err instanceof ApiError && err.message
          ? err.message
          : 'Failed to load tasks',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { tasks, isLoading, error, reload: load }
}
