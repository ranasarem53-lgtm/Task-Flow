import { Router } from 'express'
import { authController } from './auth.controller'
import { validate } from '../../middleware/validate'
import { loginSchema, registerSchema } from './auth.validator'

export const authRouter = Router()

authRouter.post('/register', validate(registerSchema, 'body'), authController.register)
authRouter.post('/login', validate(loginSchema, 'body'), authController.login)
