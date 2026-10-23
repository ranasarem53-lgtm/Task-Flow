import { Router } from 'express'
import { authRouter } from '../modules/auth/auth.routes'
import { taskRouter } from '../modules/tasks/task.routes'

// Single place where feature modules are mounted. Adding a module means
// importing its router here and registering it below — app.ts stays untouched.
export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/tasks', taskRouter)
