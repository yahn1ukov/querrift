import type { DBConnectionEvent } from '@shared/events/db-connection.event'
import type { BrowserWindow } from 'electron'
import { DBFactory } from '@main/db/db.factory'
import { registerDBConnectionHandlers } from '@main/ipc/db-connection.handler'
import { DBConnectionRepository } from '@main/repositories/db-connection.repository'
import { DBConnectionSessionService } from '@main/services/db-connection-session.service'
import { DBConnectionService } from '@main/services/db-connection.service'
import { ipcMain } from 'electron'
import EventEmitter from 'eventemitter3'

export function bootstrap(getWindow: () => BrowserWindow | null) {
  const dbConnectionEventBus = new EventEmitter<DBConnectionEvent>()

  const dbConnectionService = new DBConnectionService(
    new DBConnectionRepository(),
    dbConnectionEventBus,
  )
  const dbConnectionSessionService = new DBConnectionSessionService(
    dbConnectionService,
    new DBFactory(),
    dbConnectionEventBus,
  )

  registerDBConnectionHandlers(
    ipcMain,
    getWindow,
    dbConnectionService,
    dbConnectionSessionService,
    dbConnectionEventBus,
  )
}
