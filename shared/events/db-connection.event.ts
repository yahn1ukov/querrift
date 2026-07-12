import type { EVENT_BUS } from '@shared/constants/event-bus.constant'
import type { DBConnectionDTO, DBConnectionLostDTO } from '@shared/dtos/db-connection.dto'

export interface DBConnectionEvent {
  [EVENT_BUS.DB_CONNECTION.CONNECTED]: (id: string) => void
  [EVENT_BUS.DB_CONNECTION.DISCONNECTED]: () => void
  [EVENT_BUS.DB_CONNECTION.LOST]: (dto: DBConnectionLostDTO) => void
  [EVENT_BUS.DB_CONNECTION.CREATED]: (dto: DBConnectionDTO) => void
  [EVENT_BUS.DB_CONNECTION.UPDATED]: (dto: DBConnectionDTO) => void
  [EVENT_BUS.DB_CONNECTION.DELETED]: (id: string) => void
}
