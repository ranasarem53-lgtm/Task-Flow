import { Router } from 'express'
import { taskController } from './task.controller'
import { authenticate } from '../../middleware/auth'
import { validate } from '../../middleware/validate'
import { createTaskSchema, taskIdSchema, updateTaskSchema } from './task.validator'

// Every route below requires a valid JWT; task ownership is
// enforced inside the service layer, scoped by req.user.id.
export const taskRouter = Router()

taskRouter.use(authenticate)

taskRouter.get('/', taskController.list)
taskRouter.post('/', validate(createTaskSchema, 'body'), taskController.create)
taskRouter.get('/:id', validate(taskIdSchema, 'params'), taskController.get)
taskRouter.patch('/:id', validate(taskIdSchema, 'params'), validate(updateTaskSchema, 'body'), taskController.update)
taskRouter.patch('/:id/toggle', validate(taskIdSchema, 'params'), taskController.toggle)
taskRouter.delete('/:id', validate(taskIdSchema, 'params'), taskController.remove)
