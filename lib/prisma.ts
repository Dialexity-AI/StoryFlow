// Lazily require Prisma only when a database is configured.
// This avoids build/runtime errors on environments without generated Prisma Client.
type PrismaClientType = any

let prismaInstance: PrismaClientType | null = null

if (process.env.DATABASE_URL) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { PrismaClient } = require('@prisma/client') as { PrismaClient: PrismaClientType }
	const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientType }
	prismaInstance = globalForPrisma.prisma || new PrismaClient({
		log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
	})
	if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaInstance
}

export const prisma = prismaInstance
