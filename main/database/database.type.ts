import type { DB_TYPE } from '@shared/constants/db.constant'

export interface IPostgresConfig {
  type: typeof DB_TYPE.POSTGRES
  host: string
  port: number
  username: string
  password: string
  database: string
}

export interface ISQLiteConfig {
  type: typeof DB_TYPE.SQLITE
  path: string
}

export type DatabaseConfig = IPostgresConfig | ISQLiteConfig
