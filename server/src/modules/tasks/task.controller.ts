import { Response, NextFunction } from 'express';
import { taskService } from './task.service';
// هذا السطر هو الأهم، هو الذي يُعرّف السيرفر بوجود المستخدم (user)
import { AuthRequest } from '../../middleware/auth';

export const listTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tasks = await taskService.listTasks(req.user!.id);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.getTask(req.user!.id, req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.createTask(req.user!.id, req.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.updateTask(req.user!.id, req.params.id, req.body);
    if (!task) return res.status(404).json({ message: 'Task not found or unauthorized' });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await taskService.deleteTask(req.user!.id, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};