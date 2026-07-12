import type SQLiteClient from 'better-sqlite3'
import type { Client as PostgresClient } from 'pg'

export type DBClient = PostgresClient | SQLiteClient.Database
