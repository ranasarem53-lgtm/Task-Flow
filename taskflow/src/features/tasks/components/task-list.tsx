import { useState } from 'react'
import { Button } from '../../../components/ui'
import { useTaskMutations } from '../hooks/use-task-mutations'
import { useTasks } from '../hooks/use-tasks'
import type { Task, TaskStatusFilter } from '../types/task-types'
import { TaskFormModal } from './task-form-modal'
import { TaskItem } from './task-item'

const STATUS_FILTERS: TaskStatusFilter[] = ['all', 'pending', 'completed']

export function filterTasksByStatus(
  tasks: Task[],
  status: TaskStatusFilter,
): Task[] {
  if (status === 'all') return tasks
  return tasks.filter((task) => task.status === status)
}

export function TaskList() {
  const { tasks, isLoading, error, reload } = useTasks()
  const { isMutating, createTask, updateTask, toggleTaskCompletion, deleteTask } =
    useTaskMutations(() => void reload())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [mutationError, setMutationError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>('all')

  if (isLoading) {
    return <p>Loading tasks...</p>
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <Button onClick={() => void reload()}>Retry</Button>
      </div>
    )
  }

  const visibleTasks = filterTasksByStatus(tasks, statusFilter)

  return (
    <section>
      <div className="task-toolbar">
        <div className="task-filters" role="group" aria-label="Filter tasks by status">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`button button-sm task-filter${
                statusFilter === filter ? ' task-filter-active' : ''
              }`}
              onClick={() => setStatusFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
        <Button
          onClick={() => {
            setMutationError(null)
            setEditingTask(null)
            setIsModalOpen(true)
          }}
        >
          + New task
        </Button>
      </div>

      {mutationError ? <p role="alert">{mutationError}</p> : null}

      {visibleTasks.length === 0 ? (
        <p>No tasks yet. Create your first task!</p>
      ) : (
        <ul>
          {visibleTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isMutating={isMutating}
              onEdit={(t) => {
                setMutationError(null)
                setEditingTask(t)
                setIsModalOpen(true)
              }}
              onToggle={(t) => {
                setMutationError(null)
                void toggleTaskCompletion(t).catch(() =>
                  setMutationError('Failed to update task'),
                )
              }}
              onDelete={(id) => {
                setMutationError(null)
                void deleteTask(id).catch(() =>
                  setMutationError('Failed to delete task'),
                )
              }}
            />
          ))}
        </ul>
      )}

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isMutating={isMutating}
        task={editingTask}
        onSubmit={async (input) => {
          try {
            if (editingTask) {
              await updateTask(editingTask.id, input)
            } else {
              await createTask(input)
            }
          } catch {
            setMutationError(editingTask ? 'Failed to update task' : 'Failed to create task')
          }
        }}
      />
    </section>
  )
}
