import type { SQLiteSchema } from '@shared/schemas/sqlite.schema'
import type { z } from 'zod'

export type SQLiteConnectionConfig = z.infer<typeof SQLiteSchema>
