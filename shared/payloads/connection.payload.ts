import type { createConnectionSchema, updateConnectionSchema } from '@shared/schemas/connection.schema'
import type { z } from 'zod'

export type ICreateConnectionPayload = z.infer<typeof createConnectionSchema>

export type IUpdateConnectionPayload = z.infer<typeof updateConnectionSchema>
