export { PostgresAdapter } from '@main/database/adapters/postgres.adapter'
export { SQLiteAdapter } from '@main/database/adapters/sqlite.adapter'

export interface IDatabaseAdapter {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  test: () => Promise<boolean>
}
