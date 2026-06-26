import type { DatabaseConfig } from '@main/database/database.type'
import { DB_TYPE } from '@shared/constants/db.constant'
import SQLite from 'better-sqlite3'
import { Client as PostgresClient } from 'pg'

type Client = PostgresClient | SQLite.Database

export class DatabaseMapper {
  static toClient(config: DatabaseConfig): Client {
    switch (config.type) {
      case DB_TYPE.POSTGRES:
        return new PostgresClient({
          host: config.host,
          port: config.port,
          user: config.username,
          password: config.password,
          database: config.database,
        })
      case DB_TYPE.SQLITE:
        return new SQLite(config.path)
      default:
        throw new Error('Unsupported database type.')
    }
  }
}
