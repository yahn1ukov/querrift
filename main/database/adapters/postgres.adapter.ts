import type { IDatabaseAdapter } from '@main/database/adapters/database.adapter'
import type { IPostgresConfig } from '@main/database/database.type'
import type { Client as PostgresClient } from 'pg'
import { DatabaseMapper } from '@main/database/database.mapper'

export class PostgresAdapter implements IDatabaseAdapter {
  private _client: PostgresClient | null = null

  constructor(private readonly config: IPostgresConfig) {}

  async connect(): Promise<void> {
    if (this._client) {
      await this._client.end()
    }

    this._client = DatabaseMapper.toClient(this.config) as PostgresClient

    try {
      await this._client.connect()
    }
    catch (err: unknown) {
      this._client = null

      throw err
    }
  }

  async disconnect(): Promise<void> {
    if (this._client) {
      await this._client.end()

      this._client = null
    }
  }

  async test(): Promise<boolean> {
    const client = DatabaseMapper.toClient(this.config) as PostgresClient

    try {
      await client.connect()

      return true
    }
    catch {
      return false
    }
    finally {
      await client.end().catch(() => {})
    }
  }
}
