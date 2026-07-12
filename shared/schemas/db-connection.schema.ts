import { PostgresSchema } from '@shared/schemas/postgres.schema'
import { SQLiteSchema } from '@shared/schemas/sqlite.schema'
import { z } from 'zod'

export const DBConnectionSchema = z.discriminatedUnion('type', [
  PostgresSchema,
  SQLiteSchema,
])

export const DBConnectionJSONSchema = DBConnectionSchema.and(z.object({
  id: z.uuid(),
  name: z.string().min(1),
}))

export const DBConnectionJSONListSchema = z.array(DBConnectionJSONSchema)

export const CreateDBConnectionSchema = z.object({
  name: z.string().min(1),
  config: DBConnectionSchema,
})

export const UpdateDBConnectionSchema = CreateDBConnectionSchema.omit({ config: true }).partial()
