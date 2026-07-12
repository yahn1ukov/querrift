export interface DBAdapter {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  test: () => Promise<boolean>
  onConnectionLost?: (callback: (error: Error) => void) => void
}
