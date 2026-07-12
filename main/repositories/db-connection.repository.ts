import type { DBConnectionJSON } from '@main/models/db-connection.model'
import type { FileRepository } from '@main/repositories/base/file.repository'
import { readFile, writeFile } from 'node:fs/promises'
import { FILE_PATHS } from '@main/constants/file-paths.constant'
import { DBConnectionModel } from '@main/models/db-connection.model'
import { JSONRepository } from '@main/repositories/base/json.repository'
import { DBConnectionJSONListSchema } from '@shared/schemas/db-connection.schema'

export class DBConnectionRepository extends JSONRepository implements FileRepository {
  constructor() {
    super(FILE_PATHS.CONNECTIONS)
  }

  async upsert(model: DBConnectionModel): Promise<void> {
    await this.mutate(async () => {
      const connections = await this.readAll()

      const index = connections.findIndex(c => c.id === model.id)
      if (index >= 0) {
        connections[index] = model.toJSON()
      }
      else {
        connections.push(model.toJSON())
      }

      await this.write(connections)
    })
  }

  async getAll(): Promise<DBConnectionModel[]> {
    const connections = await this.readAll()

    return connections.map(c => DBConnectionModel.fromJSON(c))
  }

  async getById(id: string): Promise<DBConnectionModel | null> {
    const connections = await this.getAll()

    return connections.find(c => c.id === id) ?? null
  }

  async deleteById(id: string): Promise<void> {
    await this.mutate(async () => {
      const connections = await this.readAll()

      await this.write(connections.filter(c => c.id !== id))
    })
  }

  async importFromFile(path: string): Promise<void> {
    const content = await readFile(path, 'utf-8')
    const newConnections = DBConnectionJSONListSchema.parse(JSON.parse(content))

    await this.mutate(async () => {
      const connections = await this.readAll()

      for (const newConnection of newConnections) {
        const index = connections.findIndex(c => c.id === newConnection.id)
        if (index >= 0) {
          connections[index] = newConnection
        }
        else {
          connections.push(newConnection)
        }
      }

      await this.write(connections)
    })
  }

  async exportToFile(path: string): Promise<void> {
    const connections = await this.readAll()

    await writeFile(path, JSON.stringify(connections, null, 2), 'utf-8')
  }

  private async readAll(): Promise<DBConnectionJSON[]> {
    const connections = await this.read<DBConnectionJSON[]>() ?? []

    return DBConnectionJSONListSchema.parse(connections)
  }
}
