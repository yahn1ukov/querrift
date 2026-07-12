import type { DBConnectionType } from '@shared/types/db-connection.type'
import { DB_CONNECTION_REGISTRY } from '@renderer/constants/db-connection-registry.constant'

export const DB_CONNECTION_OPTIONS = Object.entries(DB_CONNECTION_REGISTRY).map(([type, config]) => ({
  type: type as DBConnectionType,
  label: config.label,
  icon: config.icon,
}))
