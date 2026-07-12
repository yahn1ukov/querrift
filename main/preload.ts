import type { DBConnectionEvent } from '@shared/events/db-connection.event'
import type { IPCEvent } from '@shared/events/ipc.event'
import type { IPCError, IPCResult } from '@shared/types/ipc.type'
import type { IpcRendererEvent } from 'electron'
import { contextBridge, ipcRenderer, webUtils } from 'electron'

type RendererListener<TChannel extends keyof DBConnectionEvent> = (
  event: IpcRendererEvent,
  ...args: Parameters<DBConnectionEvent[TChannel]>
) => void

function toRendererError(ipcError: IPCError): Error {
  const error = new Error(ipcError.message)
  error.name = ipcError.name
  return error
}

contextBridge.exposeInMainWorld('ipcRenderer', {
  on<TChannel extends keyof DBConnectionEvent>(
    channel: TChannel,
    listener: RendererListener<TChannel>,
  ): void {
    ipcRenderer.on(channel, listener as Parameters<typeof ipcRenderer.on>[1])
  },
  off<TChannel extends keyof DBConnectionEvent>(
    channel: TChannel,
    listener: RendererListener<TChannel>,
  ): void {
    ipcRenderer.off(channel, listener as Parameters<typeof ipcRenderer.off>[1])
  },
  async invoke<TChannel extends keyof IPCEvent>(
    channel: TChannel,
    ...args: Parameters<IPCEvent[TChannel]>
  ): Promise<Awaited<ReturnType<IPCEvent[TChannel]>>> {
    const result = await ipcRenderer.invoke(channel, ...args) as IPCResult<Awaited<ReturnType<IPCEvent[TChannel]>>>
    if (result.ok) {
      return result.data
    }

    throw toRendererError(result.error)
  },
})

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  getPathForFile: (file: File) => webUtils.getPathForFile(file),
})
