import type { IDatabaseAdapter } from '@main/database/adapters/database.adapter'
import type { ConnectionConfig } from '@shared/types/connection.type'
import { PostgresAdapter } from '@main/database/adapters/postgres.adapter'
import { SQLiteAdapter } from '@main/database/adapters/sqlite.adapter'
import { DB_TYPE } from '@shared/constants/db.constant'

export class ConnectionFactory {
  create(config: ConnectionConfig): IDatabaseAdapter {
    switch (config.type) {
      case DB_TYPE.POSTGRES:
        return new PostgresAdapter(config)
      case DB_TYPE.SQLITE:
        return new SQLiteAdapter(config)
      default:
        throw new Error('Unsupported database type.')
    }
  }
}
