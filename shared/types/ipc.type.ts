export interface IPCError {
  name: string
  message: string
}

export type IPCResult<T> = { ok: true, data: T } | { ok: false, error: IPCError }
