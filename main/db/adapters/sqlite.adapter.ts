import type { DBAdapter } from '@main/db/adapters/db.adapter'
import type { SQLiteConnectionConfig } from '@main/db/configs/sqlite-connection.config'
import type { Database as SQLiteDatabase } from 'better-sqlite3'
import { DBClientMapper } from '@main/mappers/db-client.mapper'

export class SQLiteAdapter implements DBAdapter {
  private _db: SQLiteDatabase | null = null

  constructor(private readonly config: SQLiteConnectionConfig) {}

  async connect(): Promise<void> {
    if (this._db) {
      this._db.close()
    }

    try {
      this._db = DBClientMapper.toClient(this.config) as SQLiteDatabase
    }
    catch (err: unknown) {
      this._db = null

      throw err
    }
  }

  async disconnect(): Promise<void> {
    if (this._db) {
      this._db.close()

      this._db = null
    }
  }

  async test(): Promise<boolean> {
    let database: SQLiteDatabase | null = null

    try {
      database = DBClientMapper.toClient(this.config) as SQLiteDatabase

      database.prepare('SELECT 1').run()

      return true
    }
    catch {
      return false
    }
    finally {
      database?.close()
    }
  }
}
