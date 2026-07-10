import { PrismaClient } from '@prisma/client'

// Singleton pattern — ป้องกัน multiple instances ใน development
const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ['warn', 'error'] })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

