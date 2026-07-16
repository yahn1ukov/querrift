import type { DBConnectionSessionService } from '@main/services/db-connection-session.service'
import type { DBConnectionService } from '@main/services/db-connection.service'
import type { CreateDBConnectionDTO, UpdateDBConnectionDTO } from '@shared/dtos/db-connection.dto'
import type { DBConnectionEvent } from '@shared/events/db-connection.event'
import type { BrowserWindow, IpcMain } from 'electron'
import type EventEmitter from 'eventemitter3'
import { registerIPCHandler } from '@main/utils/ipc-result'
import { createWindowDispatcher } from '@main/utils/window-dispatcher'
import { EVENT_BUS } from '@shared/constants/event-bus.constant'
import { EVENT_IPC } from '@shared/constants/event-ipc.constant'

export function registerDBConnectionHandlers(
  ipc: IpcMain,
  getWindow: () => BrowserWindow | null,
  connectionService: DBConnectionService,
  sessionService: DBConnectionSessionService,
  eventBus: EventEmitter<DBConnectionEvent>,
): void {
  registerIPCHandler(ipc, EVENT_IPC.DB_CONNECTION.CONNECT, (id: string) => sessionService.connect(id))
  registerIPCHandler(ipc, EVENT_IPC.DB_CONNECTION.DISCONNECT, () => sessionService.disconnect())
  registerIPCHandler(ipc, EVENT_IPC.DB_CONNECTION.TEST, (config: CreateDBConnectionDTO['config']) => sessionService.test(config))

  registerIPCHandler(ipc, EVENT_IPC.DB_CONNECTION.CREATE, (dto: CreateDBConnectionDTO) => connectionService.create(dto))
  registerIPCHandler(ipc, EVENT_IPC.DB_CONNECTION.GET_ALL, () => connectionService.getAll())
  registerIPCHandler(ipc, EVENT_IPC.DB_CONNECTION.GET_ACTIVE, async () => sessionService.activeConnectionId)
  registerIPCHandler(ipc, EVENT_IPC.DB_CONNECTION.GET, (id: string) => connectionService.get(id))
  registerIPCHandler(ipc, EVENT_IPC.DB_CONNECTION.UPDATE, (id: string, dto: UpdateDBConnectionDTO) => connectionService.update(id, dto))
  registerIPCHandler(ipc, EVENT_IPC.DB_CONNECTION.DELETE, async (id: string) => {
    if (sessionService.activeConnectionId === id) {
      await sessionService.disconnect()
    }

    await connectionService.delete(id)
  })

  registerIPCHandler(ipc, EVENT_IPC.DB_CONNECTION.IMPORT, (path: string) => connectionService.importFromFile(path))
  registerIPCHandler(ipc, EVENT_IPC.DB_CONNECTION.EXPORT, (path: string) => connectionService.exportToFile(path))

  const dispatch = createWindowDispatcher(getWindow)

  eventBus.on(EVENT_BUS.DB_CONNECTION.CONNECTED, id => dispatch(EVENT_BUS.DB_CONNECTION.CONNECTED, id))
  eventBus.on(EVENT_BUS.DB_CONNECTION.DISCONNECTED, () => dispatch(EVENT_BUS.DB_CONNECTION.DISCONNECTED))
  eventBus.on(EVENT_BUS.DB_CONNECTION.LOST, dto => dispatch(EVENT_BUS.DB_CONNECTION.LOST, dto))
  eventBus.on(EVENT_BUS.DB_CONNECTION.CREATED, dto => dispatch(EVENT_BUS.DB_CONNECTION.CREATED, dto))
  eventBus.on(EVENT_BUS.DB_CONNECTION.UPDATED, dto => dispatch(EVENT_BUS.DB_CONNECTION.UPDATED, dto))
  eventBus.on(EVENT_BUS.DB_CONNECTION.DELETED, id => dispatch(EVENT_BUS.DB_CONNECTION.DELETED, id))
}
