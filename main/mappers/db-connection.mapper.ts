import type { DBConnectionModel } from '@main/models/db-connection.model'
import type { DBConnectionDTO } from '@shared/dtos/db-connection.dto'

export class DBConnectionMapper {
  static toDTO(model: DBConnectionModel): DBConnectionDTO {
    return {
      id: model.id,
      name: model.name,
      type: model.config.type,
    }
  }
}
