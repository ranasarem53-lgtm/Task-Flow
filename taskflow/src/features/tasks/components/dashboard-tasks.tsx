import { useState } from 'react'
import { Button } from '../../../components/ui'
import { useTaskMutations } from '../hooks/use-task-mutations'
import type { Task, TaskStatusFilter } from '../types/task-types'
import { filterTasksByStatus } from './task-list'
import { TaskFormModal } from './task-form-modal'
import { TaskItem } from './task-item'

function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'completed') return false
  return new Date(task.dueDate).getTime() < Date.now()
}

type SummaryCardsProps = {
  tasks: Task[]
}

export function SummaryCards({ tasks }: SummaryCardsProps) {
  const total = tasks.length
  const completed = tasks.filter((t) => t.status === 'completed').length
  const pending = tasks.filter((t) => t.status === 'pending').length
  const overdue = tasks.filter(isOverdue).length

  const cards = [
    { label: 'Total tasks', value: total, className: '' },
    { label: 'Completed', value: completed, className: ' summary-card-completed' },
    { label: 'Pending', value: pending, className: '' },
    { label: 'Overdue', value: overdue, className: ' summary-card-overdue' },
  ]

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`summary-card${card.className}`}
        >
          <p className="summary-card-label">{card.label}</p>
          <p className="summary-card-value">{card.value}</p>
        </div>
      ))}
    </div>
  )
}

type DashboardTasksProps = {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  onReload: () => void
}

export function DashboardTasks({
  tasks,
  isLoading,
  error,
  onReload,
}: DashboardTasksProps) {
  const { isMutating, createTask, updateTask, toggleTaskCompletion, deleteTask } =
    useTaskMutations(onReload)
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
        <Button onClick={onReload}>Retry</Button>
      </div>
    )
  }

  const visibleTasks = filterTasksByStatus(tasks, statusFilter).slice(0, 5)

  return (
    <div>
      <div className="task-toolbar">
        <div className="task-filters" role="group" aria-label="Filter tasks by status">
          {(['all', 'pending', 'completed'] as TaskStatusFilter[]).map((filter) => (
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
    </div>
  )
}
