import { DB_TYPE } from '@shared/constants/db.constant'
import { z } from 'zod'

export const sqliteSchema = z.object({
  type: z.literal(DB_TYPE.SQLITE),
  path: z.string().min(1).regex(/\.(db|sqlite)$/),
})
