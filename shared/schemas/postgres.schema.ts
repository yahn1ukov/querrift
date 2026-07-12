import { DB_CONNECTION_TYPES } from '@shared/constants/db-connection-types.constant'
import { z } from 'zod'

export const PostgresSchema = z.object({
  type: z.literal(DB_CONNECTION_TYPES.POSTGRES),
  host: z.string().min(1),
  port: z.number().int().min(1).max(65535),
  database: z.string().min(1),
  user: z.string().min(1),
  password: z.string(),
})
