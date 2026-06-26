import type { Connection } from '@main/models/connection.model'
import type { EVENT_BUS } from '@shared/constants/event.constant'

export interface IConnectionEvent {
  [EVENT_BUS.CONNECTION.CONNECTED]: (connection: Connection) => void
  [EVENT_BUS.CONNECTION.DISCONNECTED]: () => void
  [EVENT_BUS.CONNECTION.CREATED]: (connection: Connection) => void
  [EVENT_BUS.CONNECTION.UPDATED]: (connection: Connection) => void
  [EVENT_BUS.CONNECTION.DELETED]: (id: string) => void
}
