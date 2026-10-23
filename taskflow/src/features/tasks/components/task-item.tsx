import { Button } from '../../../components/ui'
import type { Task } from '../types/task-types'

type TaskItemProps = {
  task: Task
  isMutating: boolean
  onToggle: (task: Task) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

export function TaskItem({ task, isMutating, onToggle, onDelete, onEdit }: TaskItemProps) {
  return (
    <li className="task-item">
      <div>
        <strong className={task.status === 'completed' ? 'task-completed' : ''}>
          {task.title}
        </strong>
        <p>{task.description}</p>
        <small>
          Priority: {task.priority} | Due: {task.dueDate || '—'}
        </small>
      </div>
      <div>
        <Button
          onClick={() => onEdit(task)}
          disabled={isMutating}
        >
          Edit
        </Button>
        <Button
          onClick={() => onToggle(task)}
          disabled={isMutating}
        >
          {task.status === 'completed' ? 'Mark pending' : 'Complete'}
        </Button>
        <Button onClick={() => onDelete(task.id)} disabled={isMutating}>
          Delete
        </Button>
      </div>
    </li>
  )
}
