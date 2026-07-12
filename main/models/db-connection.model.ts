import type { DBConnectionConfig } from '@main/db/configs/db-connection.config'

export type DBConnectionJSON = DBConnectionConfig & {
  id: string
  name: string
}

export class DBConnectionModel {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly config: DBConnectionConfig,
  ) {}

  static fromJSON(json: DBConnectionJSON): DBConnectionModel {
    const { id, name, ...config } = json

    return new DBConnectionModel(id, name, config)
  }

  toJSON(): DBConnectionJSON {
    return {
      id: this.id,
      name: this.name,
      ...this.config,
    }
  }
}
