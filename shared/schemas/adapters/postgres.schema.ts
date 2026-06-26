import { DB_TYPE } from '@shared/constants/db.constant'
import { z } from 'zod'

export const postgresSchema = z.object({
  type: z.literal(DB_TYPE.POSTGRES),
  host: z.string().min(1),
  port: z.number().int().min(1).max(65535),
  username: z.string().min(1),
  password: z.string(),
  database: z.string().min(1),
})
