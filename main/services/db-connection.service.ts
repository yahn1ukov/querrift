import type { DBConnectionRepository } from '@main/repositories/db-connection.repository'
import type { CreateDBConnectionDTO, DBConnectionDTO, UpdateDBConnectionDTO } from '@shared/dtos/db-connection.dto'
import type { DBConnectionEvent } from '@shared/events/db-connection.event'
import type EventEmitter from 'eventemitter3'
import { DBConnectionMapper } from '@main/mappers/db-connection.mapper'
import { DBConnectionModel } from '@main/models/db-connection.model'
import { EVENT_BUS } from '@shared/constants/event-bus.constant'
import { CreateDBConnectionSchema, UpdateDBConnectionSchema } from '@shared/schemas/db-connection.schema'

export class DBConnectionService {
  constructor(
    private readonly repository: DBConnectionRepository,
    private readonly eventBus: EventEmitter<DBConnectionEvent>,
  ) {}

  async findById(id: string): Promise<DBConnectionModel | null> {
    return this.repository.getById(id)
  }

  async create(dto: CreateDBConnectionDTO): Promise<void> {
    const parsedDTO = CreateDBConnectionSchema.parse(dto)

    const model = new DBConnectionModel(crypto.randomUUID(), parsedDTO.name, parsedDTO.config)
    await this.repository.upsert(model)

    this.eventBus.emit(EVENT_BUS.DB_CONNECTION.CREATED, DBConnectionMapper.toDTO(model))
  }

  async getAll(): Promise<DBConnectionDTO[]> {
    const connections = await this.repository.getAll()

    return connections.map(c => DBConnectionMapper.toDTO(c))
  }

  async get(id: string): Promise<DBConnectionDTO | null> {
    const model = await this.repository.getById(id)

    return model ? DBConnectionMapper.toDTO(model) : null
  }

  async update(id: string, dto: UpdateDBConnectionDTO): Promise<void> {
    const model = await this.repository.getById(id)
    if (!model) {
      throw new Error('Connection not found')
    }

    const parsedDTO = UpdateDBConnectionSchema.parse(dto)

    const updatedModel = new DBConnectionModel(model.id, parsedDTO.name ?? model.name, model.config)
    await this.repository.upsert(updatedModel)

    this.eventBus.emit(EVENT_BUS.DB_CONNECTION.UPDATED, DBConnectionMapper.toDTO(updatedModel))
  }

  async delete(id: string): Promise<void> {
    await this.repository.deleteById(id)

    this.eventBus.emit(EVENT_BUS.DB_CONNECTION.DELETED, id)
  }

  async importFromFile(path: string): Promise<void> {
    await this.repository.importFromFile(path)
  }

  async exportToFile(path: string): Promise<void> {
    await this.repository.exportToFile(path)
  }
}
