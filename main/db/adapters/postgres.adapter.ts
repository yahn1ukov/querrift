import type { DBAdapter } from '@main/db/adapters/db.adapter'
import type { PostgresConnectionConfig } from '@main/db/configs/postgres-connection.config'
import type { Client as PostgresClient } from 'pg'
import { DBClientMapper } from '@main/mappers/db-client.mapper'

export class PostgresAdapter implements DBAdapter {
  private _client: PostgresClient | null = null
  private _onConnectionLost: ((error: Error) => void) | null = null

  constructor(private readonly config: PostgresConnectionConfig) {}

  async connect(): Promise<void> {
    if (this._client) {
      this._client.removeAllListeners('error')
      await this._client.end()
    }

    this._client = DBClientMapper.toClient(this.config) as PostgresClient

    try {
      await this._client.connect()
    }
    catch (err: unknown) {
      await this._client.end().catch(() => {})
      this._client = null

      throw err
    }

    this._client.on('error', (error: Error) => {
      this._client?.removeAllListeners('error')
      void this._client?.end().catch(() => {})
      this._client = null

      this._onConnectionLost?.(error)
    })
  }

  async disconnect(): Promise<void> {
    if (this._client) {
      this._client.removeAllListeners('error')
      await this._client.end()
      this._client = null
    }
  }

  async test(): Promise<boolean> {
    const client = DBClientMapper.toClient(this.config) as PostgresClient

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

  onConnectionLost(callback: (error: Error) => void): void {
    this._onConnectionLost = callback
  }
}
