import type { PostgresConnectionConfig } from '@main/db/configs/postgres-connection.config'
import type { SQLiteConnectionConfig } from '@main/db/configs/sqlite-connection.config'

export type DBConnectionConfig = PostgresConnectionConfig | SQLiteConnectionConfig
