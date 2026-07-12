import type { DBAdapter } from '@main/db/adapters/db.adapter'
import type { DBConnectionConfig } from '@main/db/configs/db-connection.config'
import { PostgresAdapter } from '@main/db/adapters/postgres.adapter'
import { SQLiteAdapter } from '@main/db/adapters/sqlite.adapter'
import { assertUnreachable } from '@main/utils/assert-unreachable'
import { DB_CONNECTION_TYPES } from '@shared/constants/db-connection-types.constant'

export class DBFactory {
  create(config: DBConnectionConfig): DBAdapter {
    switch (config.type) {
      case DB_CONNECTION_TYPES.POSTGRES:
        return new PostgresAdapter(config)
      case DB_CONNECTION_TYPES.SQLITE:
        return new SQLiteAdapter(config)
      default:
        return assertUnreachable(config)
    }
  }
}
