import type { IDatabaseAdapter } from '@main/database/adapters/database.adapter'
import type { ISQLiteConfig } from '@main/database/database.type'
import type { Database as SQLiteDatabase } from 'better-sqlite3'
import { DatabaseMapper } from '@main/database/database.mapper'

export class SQLiteAdapter implements IDatabaseAdapter {
  private _database: SQLiteDatabase | null = null

  constructor(private readonly config: ISQLiteConfig) {}

  async connect(): Promise<void> {
    if (this._database) {
      this._database.close()
    }

    try {
      this._database = DatabaseMapper.toClient(this.config) as SQLiteDatabase
    }
    catch (err: unknown) {
      this._database = null

      throw err
    }
  }

  async disconnect(): Promise<void> {
    if (this._database) {
      this._database.close()

      this._database = null
    }
  }

  async test(): Promise<boolean> {
    let database: SQLiteDatabase | null = null

    try {
      database = DatabaseMapper.toClient(this.config) as SQLiteDatabase

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
