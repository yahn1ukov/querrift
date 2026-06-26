import type { IDatabaseAdapter } from '@main/database/adapters/database.adapter'
import type { DatabaseConfig } from '@main/database/database.type'
import { PostgresAdapter, SQLiteAdapter } from '@main/database/adapters/database.adapter'
import { DB_TYPE } from '@shared/constants/db.constant'

export class DatabaseFactory {
  create(config: DatabaseConfig): IDatabaseAdapter {
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
