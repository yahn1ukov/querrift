import { DB_CONNECTION_TYPES } from '@shared/constants/db-connection-types.constant'
import { z } from 'zod'

export const SQLiteSchema = z.object({
  type: z.literal(DB_CONNECTION_TYPES.SQLITE),
  path: z.string().min(1).regex(/\.(db|sqlite|sqlite3|db3|s3db|sl3|sdb)$/),
})
