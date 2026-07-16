import type { BrowserWindow } from 'electron'

export function createWindowDispatcher(getWindow: () => BrowserWindow | null) {
  return (channel: string, ...args: unknown[]): void => {
    const window = getWindow()
    if (window && !window.isDestroyed()) {
      window.webContents.send(channel, ...args)
    }
  }
}
