import { Router } from 'express';
import * as taskController from './task.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createTaskSchema, updateTaskSchema } from './task.validator';

export const taskRouter = Router();

taskRouter.use(authenticate);

taskRouter.get('/', taskController.listTasks);
taskRouter.get('/:id', taskController.getTask);
taskRouter.post('/', validate(createTaskSchema), taskController.createTask);
taskRouter.patch('/:id', validate(updateTaskSchema), taskController.updateTask);
taskRouter.delete('/:id', taskController.deleteTask);