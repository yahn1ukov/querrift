import type { DBConnectionConfig } from '@main/db/configs/db-connection.config'
import type { DBClient } from '@main/types/db-client.type'
import { assertUnreachable } from '@main/utils/assert-unreachable'
import { DB_CONNECTION_TYPES } from '@shared/constants/db-connection-types.constant'
import SQLiteClient from 'better-sqlite3'
import { Client as PostgresClient } from 'pg'

export class DBClientMapper {
  static toClient(config: DBConnectionConfig): DBClient {
    switch (config.type) {
      case DB_CONNECTION_TYPES.POSTGRES:
        return new PostgresClient({
          host: config.host,
          port: config.port,
          database: config.database,
          user: config.user,
          password: config.password,
        })
      case DB_CONNECTION_TYPES.SQLITE:
        return new SQLiteClient(config.path, {
          fileMustExist: true,
        })
      default:
        return assertUnreachable(config)
    }
  }
}
