import type { PostgresSchema } from '@shared/schemas/postgres.schema'
import type { z } from 'zod'

export type PostgresConnectionConfig = z.infer<typeof PostgresSchema>
