import type { ConnectionJSON } from '@main/models/connection.model'
import type { IJSONRepository } from '@main/repositories/json.repository'
import { readFile, writeFile } from 'node:fs/promises'
import { Connection } from '@main/models/connection.model'
import { JSONRepository } from '@main/repositories/json.repository'
import { PATH } from '@shared/constants/path.constant'

export class ConnectionRepository extends JSONRepository implements IJSONRepository {
  constructor() {
    super(PATH.CONNECTIONS)
  }

  async upsert(connection: Connection): Promise<void> {
    const connections = await this.read<ConnectionJSON[]>() ?? []

    const index = connections.findIndex(c => c.id === connection.id)
    if (index >= 0) {
      connections[index] = connection.toJSON()
    }
    else {
      connections.push(connection.toJSON())
    }

    await this.write(connections)
  }

  async getAll(): Promise<Connection[]> {
    const connections = await this.read<ConnectionJSON[]>()
    if (!connections) {
      return []
    }

    return connections.map(c => Connection.fromJSON(c))
  }

  async get(id: string): Promise<Connection | null> {
    const connections = await this.getAll()

    return connections.find(c => c.id === id) ?? null
  }

  async delete(id: string): Promise<void> {
    const connections = await this.read<ConnectionJSON[]>() ?? []

    await this.write(connections.filter(c => c.id !== id))
  }

  async importFromFile(path: string): Promise<void> {
    const content = await readFile(path, 'utf-8')

    const newConnections = JSON.parse(content) as ConnectionJSON[]

    const connections = await this.read<ConnectionJSON[]>() ?? []

    for (const connection of newConnections) {
      const index = connections.findIndex(c => c.id === connection.id)
      if (index >= 0) {
        connections[index] = connection
      }
      else {
        connections.push(connection)
      }
    }

    await this.write(connections)
  }

  async exportToFile(path: string): Promise<void> {
    const connections = await this.read<ConnectionJSON[]>() ?? []

    await writeFile(path, JSON.stringify(connections, null, 2), 'utf-8')
  }
}
