import type { DB_TYPE } from '@shared/constants/db.constant'

export interface IPostgresConnectionConfig {
  type: typeof DB_TYPE.POSTGRES
  host: string
  port: number
  username: string
  password: string
  database: string
}

export interface ISQLiteConnectionConfig {
  type: typeof DB_TYPE.SQLITE
  path: string
}

export type ConnectionConfig = IPostgresConnectionConfig | ISQLiteConnectionConfig
