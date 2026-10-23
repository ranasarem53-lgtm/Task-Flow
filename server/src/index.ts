import { createApp } from './app'
import { env } from './config/env'
import { prisma } from './lib/prisma'

async function main(): Promise<void> {
  // Verify the database is reachable before accepting traffic.
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('[db] connected to PostgreSQL')
  } catch (err) {
    console.error('[db] failed to connect to PostgreSQL:', err)
    process.exit(1)
  }

  const app = createApp()
  const server = app.listen(env.port, () => {
    console.log(`[server] TaskFlow API listening on http://localhost:${env.port}`)
  })

  // Graceful shutdown
  const shutdown = (): void => {
    console.log('[server] shutting down...')
    server.close(() => {
      void prisma.$disconnect()
      process.exit(0)
    })
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

void main()
