import express from 'express'
import cors from 'cors'
import { env } from './config/env'
import { errorHandler } from './middleware/error-handler'
import { apiRouter } from './routes'

export function createApp(): express.Express {
  const app = express()

  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '1mb' }))

  // Simple request log in development
  if (env.nodeEnv === 'development') {
    app.use((req, _res, next) => {
      console.log(`${req.method} ${req.originalUrl}`)
      next()
    })
  }

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  // All feature modules are registered in routes/index.ts
  app.use('/api', apiRouter)

  // 404 for unknown API routes
  app.use((_req, res) => {
    res.status(404).json({ message: 'Not found' })
  })

  // Centralized error handling must be registered last
  app.use(errorHandler)

  return app
}
