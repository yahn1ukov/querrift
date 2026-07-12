import type { EVENT_IPC } from '@shared/constants/event-ipc.constant'
import type { CreateDBConnectionDTO, DBConnectionDTO, UpdateDBConnectionDTO } from '@shared/dtos/db-connection.dto'

export interface IPCEvent {
  [EVENT_IPC.DB_CONNECTION.CONNECT]: (id: string) => Promise<DBConnectionDTO>
  [EVENT_IPC.DB_CONNECTION.DISCONNECT]: () => Promise<void>
  [EVENT_IPC.DB_CONNECTION.TEST]: (config: CreateDBConnectionDTO['config']) => Promise<boolean>
  [EVENT_IPC.DB_CONNECTION.CREATE]: (dto: CreateDBConnectionDTO) => Promise<void>
  [EVENT_IPC.DB_CONNECTION.GET_ALL]: () => Promise<DBConnectionDTO[]>
  [EVENT_IPC.DB_CONNECTION.GET_ACTIVE]: () => Promise<string | null>
  [EVENT_IPC.DB_CONNECTION.GET]: (id: string) => Promise<DBConnectionDTO | null>
  [EVENT_IPC.DB_CONNECTION.UPDATE]: (id: string, dto: UpdateDBConnectionDTO) => Promise<void>
  [EVENT_IPC.DB_CONNECTION.DELETE]: (id: string) => Promise<void>
  [EVENT_IPC.DB_CONNECTION.IMPORT]: (path: string) => Promise<void>
  [EVENT_IPC.DB_CONNECTION.EXPORT]: (path: string) => Promise<void>
}
