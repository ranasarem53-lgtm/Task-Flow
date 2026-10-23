import { useCallback, useState } from 'react'
import { taskService } from '../services/task-service'
import type { Task, TaskCreateInput, TaskUpdateInput } from '../types/task-types'

export function useTaskMutations(onDone: () => void) {
  const [isMutating, setIsMutating] = useState(false)

  const createTask = useCallback(
    async (input: TaskCreateInput) => {
      setIsMutating(true)
      try {
        await taskService.createTask(input)
        onDone()
      } finally {
        setIsMutating(false)
      }
    },
    [onDone],
  )

  const toggleTaskCompletion = useCallback(
    async (task: Task) => {
      setIsMutating(true)
      try {
        await taskService.toggleTaskCompletion(task.id, task.status)
        onDone()
      } finally {
        setIsMutating(false)
      }
    },
    [onDone],
  )

  const updateTask = useCallback(
    async (id: string, input: TaskUpdateInput) => {
      setIsMutating(true)
      try {
        await taskService.updateTask(id, input)
        onDone()
      } finally {
        setIsMutating(false)
      }
    },
    [onDone],
  )

  const deleteTask = useCallback(
    async (id: string) => {
      setIsMutating(true)
      try {
        await taskService.deleteTask(id)
        onDone()
      } finally {
        setIsMutating(false)
      }
    },
    [onDone],
  )

  return { isMutating, createTask, updateTask, toggleTaskCompletion, deleteTask }
}
