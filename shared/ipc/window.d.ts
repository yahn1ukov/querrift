import type { DBConnectionEvent } from '@shared/events/db-connection.event'
import type { IPCEvent } from '@shared/events/ipc.event'
import type { IpcRendererEvent } from 'electron'

declare global {
  interface Window {
    ipcRenderer: {
      on: <TChannel extends keyof DBConnectionEvent>(
        channel: TChannel,
        listener: (event: IpcRendererEvent, ...args: Parameters<DBConnectionEvent[TChannel]>) => void,
      ) => void

      off: <TChannel extends keyof DBConnectionEvent>(
        channel: TChannel,
        listener: (event: IpcRendererEvent, ...args: Parameters<DBConnectionEvent[TChannel]>) => void,
      ) => void

      invoke: <TChannel extends keyof IPCEvent>(
        channel: TChannel,
        ...args: Parameters<IPCEvent[TChannel]>
      ) => ReturnType<IPCEvent[TChannel]>
    }

    electronAPI: {
      platform: NodeJS.Platform
      getPathForFile: typeof import('electron').webUtils.getPathForFile
    }
  }
}
