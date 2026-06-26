import type { IDatabaseAdapter } from '@main/database/adapters/database.adapter'
import type { DatabaseFactory } from '@main/database/database.factory'
import type { DatabaseConfig } from '@main/database/database.type'
import type { ConnectionRepository } from '@main/repositories/connection.repository'
import type { IConnectionEvent } from '@main/services/events/connection.event'
import type { ICreateConnectionPayload, IUpdateConnectionPayload } from '@shared/payloads/connection.payload'
import type EventEmitter from 'eventemitter3'
import { Connection } from '@main/models/connection.model'
import { EVENT_BUS } from '@shared/constants/event.constant'

export class ConnectionService {
  private _adapter: IDatabaseAdapter | null = null
  private _activeConnectionId: string | null = null

  constructor(
    private readonly repository: ConnectionRepository,
    private readonly factory: DatabaseFactory,
    private readonly eventBus: EventEmitter<IConnectionEvent>,
  ) {}

  async connect(connection: Connection): Promise<void> {
    await this.disconnect()

    this._adapter = this.factory.create(connection.config)

    await this._adapter.connect()
    this._activeConnectionId = connection.id

    this.eventBus.emit(EVENT_BUS.CONNECTION.CONNECTED, connection)
  }

  async disconnect(): Promise<void> {
    if (this._adapter) {
      await this._adapter.disconnect()

      this._adapter = null
      this._activeConnectionId = null

      this.eventBus.emit(EVENT_BUS.CONNECTION.DISCONNECTED)
    }
  }

  async test(config: DatabaseConfig): Promise<boolean> {
    const adapter = this.factory.create(config)

    return adapter.test()
  }

  async create(payload: ICreateConnectionPayload): Promise<void> {
    const connection = new Connection(crypto.randomUUID(), payload.name, payload.config)

    await this.repository.upsert(connection)

    this.eventBus.emit(EVENT_BUS.CONNECTION.CREATED, connection)
  }

  async getAll(): Promise<Connection[]> {
    return this.repository.getAll()
  }

  async get(id: string): Promise<Connection | null> {
    return this.repository.get(id)
  }

  async update(id: string, payload: IUpdateConnectionPayload): Promise<void> {
    const connection = await this.repository.get(id)
    if (!connection) {
      throw new Error('Connection not found')
    }

    const updatedConnection = new Connection(connection.id, payload.name ?? connection.name, payload.config ?? connection.config)
    await this.repository.upsert(updatedConnection)

    this.eventBus.emit(EVENT_BUS.CONNECTION.UPDATED, updatedConnection)
  }

  async delete(id: string): Promise<void> {
    if (this._activeConnectionId === id) {
      await this.disconnect()
    }

    await this.repository.delete(id)

    this.eventBus.emit(EVENT_BUS.CONNECTION.DELETED, id)
  }

  async importFromFile(path: string): Promise<void> {
    await this.repository.importFromFile(path)
  }

  async exportToFile(path: string): Promise<void> {
    await this.repository.exportToFile(path)
  }
}
