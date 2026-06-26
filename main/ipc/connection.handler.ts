import type { DatabaseConfig } from '@main/database/database.type'
import type { Connection } from '@main/models/connection.model'
import type { ConnectionService } from '@main/services/connection.service'
import type { IConnectionEvent } from '@main/services/events/connection.event'
import type { ICreateConnectionPayload, IUpdateConnectionPayload } from '@shared/payloads/connection.payload'
import type { BrowserWindow, IpcMain } from 'electron'
import type EventEmitter from 'eventemitter3'
import { EVENT_BUS } from '@shared/constants/event.constant'
import { IPC } from '@shared/constants/ipc.constant'

export function registerConnectionHandlers(
  ipc: IpcMain,
  window: BrowserWindow,
  service: ConnectionService,
  eventBus: EventEmitter<IConnectionEvent>,
): void {
  ipc.handle(IPC.CONNECTION.CONNECT, (_, connection: Connection) => service.connect(connection))
  ipc.handle(IPC.CONNECTION.DISCONNECT, () => service.disconnect())
  ipc.handle(IPC.CONNECTION.TEST, (_, config: DatabaseConfig) => service.test(config))
  ipc.handle(IPC.CONNECTION.GET_ALL, () => service.getAll())
  ipc.handle(IPC.CONNECTION.GET, (_, id: string) => service.get(id))
  ipc.handle(IPC.CONNECTION.CREATE, (_, payload: ICreateConnectionPayload) => service.create(payload))
  ipc.handle(IPC.CONNECTION.UPDATE, (_, id: string, payload: IUpdateConnectionPayload) => service.update(id, payload))
  ipc.handle(IPC.CONNECTION.DELETE, (_, id: string) => service.delete(id))
  ipc.handle(IPC.CONNECTION.IMPORT, (_, path: string) => service.importFromFile(path))
  ipc.handle(IPC.CONNECTION.EXPORT, (_, path: string) => service.exportToFile(path))

  eventBus.on(EVENT_BUS.CONNECTION.CONNECTED, (connection: Connection) => window.webContents.send(EVENT_BUS.CONNECTION.CONNECTED, connection))
  eventBus.on(EVENT_BUS.CONNECTION.DISCONNECTED, () => window.webContents.send(EVENT_BUS.CONNECTION.DISCONNECTED))
  eventBus.on(EVENT_BUS.CONNECTION.CREATED, (connection: Connection) => window.webContents.send(EVENT_BUS.CONNECTION.CREATED, connection))
  eventBus.on(EVENT_BUS.CONNECTION.UPDATED, (connection: Connection) => window.webContents.send(EVENT_BUS.CONNECTION.UPDATED, connection))
  eventBus.on(EVENT_BUS.CONNECTION.DELETED, (id: string) => window.webContents.send(EVENT_BUS.CONNECTION.DELETED, id))
}
