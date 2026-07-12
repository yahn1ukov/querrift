import type { CreateDBConnectionSchema, UpdateDBConnectionSchema } from '@shared/schemas/db-connection.schema'
import type { DBConnectionType } from '@shared/types/db-connection.type'
import type { z } from 'zod'

export interface DBConnectionDTO {
  id: string
  name: string
  type: DBConnectionType
}

export interface DBConnectionLostDTO {
  id: string | null
  message: string
}

export type CreateDBConnectionDTO = z.infer<typeof CreateDBConnectionSchema>

export type UpdateDBConnectionDTO = z.infer<typeof UpdateDBConnectionSchema>
