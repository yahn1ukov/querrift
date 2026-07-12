import type { CreateDBConnectionDTO, UpdateDBConnectionDTO } from '@shared/dtos/db-connection.dto'
import { EVENT_IPC } from '@shared/constants/event-ipc.constant'

export const dbConnection = {
  connect: (id: string) => window.ipcRenderer.invoke(EVENT_IPC.DB_CONNECTION.CONNECT, id),
  disconnect: () => window.ipcRenderer.invoke(EVENT_IPC.DB_CONNECTION.DISCONNECT),
  test: (config: CreateDBConnectionDTO['config']) => window.ipcRenderer.invoke(EVENT_IPC.DB_CONNECTION.TEST, config),

  create: (dto: CreateDBConnectionDTO) => window.ipcRenderer.invoke(EVENT_IPC.DB_CONNECTION.CREATE, dto),
  getAll: () => window.ipcRenderer.invoke(EVENT_IPC.DB_CONNECTION.GET_ALL),
  getActive: () => window.ipcRenderer.invoke(EVENT_IPC.DB_CONNECTION.GET_ACTIVE),
  get: (id: string) => window.ipcRenderer.invoke(EVENT_IPC.DB_CONNECTION.GET, id),
  update: (id: string, dto: UpdateDBConnectionDTO) => window.ipcRenderer.invoke(EVENT_IPC.DB_CONNECTION.UPDATE, id, dto),
  delete: (id: string) => window.ipcRenderer.invoke(EVENT_IPC.DB_CONNECTION.DELETE, id),

  importFromFile: (path: string) => window.ipcRenderer.invoke(EVENT_IPC.DB_CONNECTION.IMPORT, path),
  exportToFile: (path: string) => window.ipcRenderer.invoke(EVENT_IPC.DB_CONNECTION.EXPORT, path),
} as const

export const ipcClient = {
  dbConnection,
} as const
