import type { NextFunction, Request, Response } from 'express'
import { taskService } from './task.service'
import { HttpError } from '../../middleware/http-error'

type TaskParams = { id: string }

function requireUserId(req: Request): string {
  if (!req.user) {
    throw new HttpError(401, 'Authentication required')
  }
  return req.user.id
}

export const taskController = {
  // GET /api/tasks
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tasks = await taskService.listTasks(requireUserId(req))
      res.status(200).json(tasks)
      return
    } catch (err) {
      next(err)
    }
  },

  // GET /api/tasks/:id
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as TaskParams
      const task = await taskService.getTask(requireUserId(req), id)
      res.status(200).json(task)
      return
    } catch (err) {
      next(err)
    }
  },

  // POST /api/tasks
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await taskService.createTask(requireUserId(req), req.body)
      res.status(201).json(task)
      return
    } catch (err) {
      next(err)
    }
  },

  // PATCH /api/tasks/:id
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as TaskParams
      const task = await taskService.updateTask(requireUserId(req), id, req.body)
      res.status(200).json(task)
      return
    } catch (err) {
      next(err)
    }
  },

  // DELETE /api/tasks/:id
  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as TaskParams
      await taskService.deleteTask(requireUserId(req), id)
      res.status(204).send()
      return
    } catch (err) {
      next(err)
    }
  },

  // PATCH /api/tasks/:id/toggle
  async toggle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as TaskParams
      const task = await taskService.toggleCompletion(requireUserId(req), id)
      res.status(200).json(task)
      return
    } catch (err) {
      next(err)
    }
  },
}
