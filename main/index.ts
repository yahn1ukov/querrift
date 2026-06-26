import type { IConnectionEvent } from '@main/services/events/connection.event'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { DatabaseFactory } from '@main/database/database.factory'
import { registerConnectionHandlers } from '@main/ipc/connection.handler'
import { ConnectionRepository } from '@main/repositories/connection.repository'
import { ConnectionService } from '@main/services/connection.service'
import { app, BrowserWindow, ipcMain } from 'electron'
import EventEmitter from 'eventemitter3'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  const eventBus = new EventEmitter<IConnectionEvent>()
  const connectionService = new ConnectionService(
    new ConnectionRepository(),
    new DatabaseFactory(),
    eventBus,
  )

  registerConnectionHandlers(ipcMain, win, connectionService, eventBus)

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  }
  else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (!BrowserWindow.getAllWindows().length) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
