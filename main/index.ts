import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { bootstrap } from '@main/bootstrap'
import { app, BrowserWindow } from 'electron'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let window: BrowserWindow | null = null

function createWindow() {
  window = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 1000,
    minHeight: 600,
    titleBarStyle: 'hidden',
    titleBarOverlay: process.platform === 'win32' || process.platform === 'linux'
      ? {
          color: '#ffffff',
          symbolColor: '#000000',
          height: 32,
        }
      : false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.mjs'),
      sandbox: true,
    },
  })

  window.on('closed', () => {
    window = null
  })

  if (process.env.NODE_ENV === 'development') {
    window.webContents.openDevTools()
  }

  if (process.env.VITE_DEV_SERVER_URL) {
    window.loadURL(process.env.VITE_DEV_SERVER_URL)
  }
  else {
    window.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (!BrowserWindow.getAllWindows().length) {
    createWindow()
  }
})

app.whenReady().then(() => {
  bootstrap(() => window)
  createWindow()
})
