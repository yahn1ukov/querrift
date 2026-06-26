import { postgresSchema, sqliteSchema } from '@shared/schemas/adapters'
import { z } from 'zod'

const connectionSchema = z.discriminatedUnion('type', [
  postgresSchema,
  sqliteSchema,
])

export const createConnectionSchema = z.object({
  name: z.string().min(1),
  config: connectionSchema,
})

export const updateConnectionSchema = createConnectionSchema.partial()
