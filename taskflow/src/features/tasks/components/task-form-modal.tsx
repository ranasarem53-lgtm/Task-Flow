import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'

// '2026-01-01T00:00:00.000Z' -> '2026-01-01' for <input type="date">.
function toDateInputValue(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : ''
}
import { Button, Input, Modal } from '../../../components/ui'
import type { Task, TaskCreateInput, TaskPriority } from '../types/task-types'

type TaskFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: TaskCreateInput) => Promise<void>
  isMutating: boolean
  /** When provided the modal edits this task instead of creating one. */
  task?: Task | null
}

export function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  isMutating,
  task,
}: TaskFormModalProps) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium')
  // Backend returns a full ISO string; <input type="date"> needs YYYY-MM-DD.
  const [dueDate, setDueDate] = useState(toDateInputValue(task?.dueDate))
  const [validationError, setValidationError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  // Re-sync form state when the modal opens for a different task,
  // otherwise it keeps the values from the previous open.
  useEffect(() => {
    setTitle(task?.title ?? '')
    setDescription(task?.description ?? '')
    setPriority(task?.priority ?? 'medium')
    setDueDate(toDateInputValue(task?.dueDate))
    setValidationError(null)
    setFormError(null)
  }, [task, isOpen])

  const reset = () => {
    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
    setValidationError(null)
    setFormError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (title.trim() === '') {
      setValidationError('Title is required')
      return
    }
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate,
      })
      reset()
      onClose()
    } catch {
      setFormError('Failed to save task. Please try again.')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit task' : 'Create task'}>
      <form onSubmit={(event: FormEvent<HTMLFormElement>) => void handleSubmit(event)}>
        {formError ? (
          <p role="alert" className="input-error">
            {formError}
          </p>
        ) : null}

        <Input
          label="Title"
          value={title}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
          error={validationError ?? undefined}
        />
        <Input
          label="Description"
          value={description}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setDescription(event.target.value)}
        />
        <label className="input-label" htmlFor="task-priority">
          Priority
        </label>
        <select
          id="task-priority"
          className="input-field"
          value={priority}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => setPriority(event.target.value as TaskPriority)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <Input
          label="Due date"
          type="date"
          value={dueDate}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setDueDate(event.target.value)}
        />
        <Button type="submit" disabled={isMutating}>
          {isMutating ? 'Saving...' : task ? 'Update' : 'Save'}
        </Button>
      </form>
    </Modal>
  )
}
