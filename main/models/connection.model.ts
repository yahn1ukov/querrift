import type { ConnectionConfig } from '@shared/types/connection.type'

export type ConnectionJSON = ConnectionConfig & {
  id: string
  name: string
}

export class Connection {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly config: ConnectionConfig,
  ) {}

  static fromJSON(json: ConnectionJSON): Connection {
    const { id, name, ...config } = json

    return new Connection(id, name, config)
  }

  toJSON(): ConnectionJSON {
    return {
      id: this.id,
      name: this.name,
      ...this.config,
    }
  }
}
