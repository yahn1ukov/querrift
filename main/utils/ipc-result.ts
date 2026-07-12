import type { IPCEvent } from '@shared/events/ipc.event'
import type { IPCError, IPCResult } from '@shared/types/ipc.type'
import type { IpcMain } from 'electron'

type IPCHandler<TChannel extends keyof IPCEvent> = (
  ...args: Parameters<IPCEvent[TChannel]>
) => Awaited<ReturnType<IPCEvent[TChannel]>> | ReturnType<IPCEvent[TChannel]>

function serializeIPCError(error: unknown): IPCError {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    }
  }

  return {
    name: 'Error',
    message: typeof error === 'string' ? error : 'Unknown error',
  }
}

export function registerIPCHandler<TChannel extends keyof IPCEvent>(
  ipc: IpcMain,
  channel: TChannel,
  handler: IPCHandler<TChannel>,
): void {
  ipc.handle(channel, async (_event, ...args: unknown[]): Promise<IPCResult<Awaited<ReturnType<IPCEvent[TChannel]>>>> => {
    try {
      const data = await handler(...args as Parameters<IPCEvent[TChannel]>)

      return {
        ok: true,
        data,
      }
    }
    catch (error: unknown) {
      console.error(`[IPC:${String(channel)}]`, error)

      return {
        ok: false,
        error: serializeIPCError(error),
      }
    }
  })
}
