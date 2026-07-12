import type { DBAdapter } from '@main/db/adapters/db.adapter'
import type { DBFactory } from '@main/db/db.factory'
import type { DBConnectionService } from '@main/services/db-connection.service'
import type { CreateDBConnectionDTO, DBConnectionDTO } from '@shared/dtos/db-connection.dto'
import type { DBConnectionEvent } from '@shared/events/db-connection.event'
import type EventEmitter from 'eventemitter3'
import { DBConnectionMapper } from '@main/mappers/db-connection.mapper'
import { Mutex } from '@main/utils/mutex'
import { EVENT_BUS } from '@shared/constants/event-bus.constant'
import { DBConnectionSchema } from '@shared/schemas/db-connection.schema'

export class DBConnectionSessionService {
  private _adapter: DBAdapter | null = null
  private _connectionId: string | null = null
  private readonly mutex = new Mutex()

  constructor(
    private readonly dbConnectionService: DBConnectionService,
    private readonly factory: DBFactory,
    private readonly eventBus: EventEmitter<DBConnectionEvent>,
  ) {}

  get activeConnectionId(): string | null {
    return this._connectionId
  }

  async connect(id: string): Promise<DBConnectionDTO> {
    return this.mutex.run(async () => {
      const model = await this.dbConnectionService.findById(id)
      if (!model) {
        throw new Error('Connection not found')
      }

      await this.disconnectCurrentConnection()

      const adapter = this.factory.create(model.config)
      await adapter.connect()

      this._adapter = adapter
      this._connectionId = model.id

      adapter.onConnectionLost?.(error => this.handleConnectionLost(error))

      this.eventBus.emit(EVENT_BUS.DB_CONNECTION.CONNECTED, model.id)

      return DBConnectionMapper.toDTO(model)
    })
  }

  async disconnect(): Promise<void> {
    await this.mutex.run(() => this.disconnectCurrentConnection())
  }

  async test(config: CreateDBConnectionDTO['config']): Promise<boolean> {
    const adapter = this.factory.create(DBConnectionSchema.parse(config))

    return adapter.test()
  }

  private async disconnectCurrentConnection(): Promise<void> {
    if (!this._adapter) {
      return
    }

    await this._adapter.disconnect()

    this._adapter = null
    this._connectionId = null

    this.eventBus.emit(EVENT_BUS.DB_CONNECTION.DISCONNECTED)
  }

  private handleConnectionLost(error: Error): void {
    const id = this._connectionId

    this._adapter = null
    this._connectionId = null

    this.eventBus.emit(EVENT_BUS.DB_CONNECTION.LOST, {
      id,
      message: error.message,
    })
  }
}
