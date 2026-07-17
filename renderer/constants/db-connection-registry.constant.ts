import type { DBConnectionRegistry } from '@renderer/types/db-connection-registry.type'
import type { DBConnectionType } from '@shared/types/db-connection.type'
import { PostgresForm } from '@renderer/components/forms/postgres-form'
import { SQLiteForm } from '@renderer/components/forms/sqlite-form'
import { DB_CONNECTION_TYPES } from '@shared/constants/db-connection-types.constant'
import { Database, HardDrive } from 'lucide-react'

export const DB_CONNECTION_REGISTRY: Record<DBConnectionType, DBConnectionRegistry> = {
  [DB_CONNECTION_TYPES.POSTGRES]: {
    label: 'PostgreSQL',
    icon: Database,
    defaultConfig: {
      type: DB_CONNECTION_TYPES.POSTGRES,
      host: '',
      port: 5432,
      database: '',
      user: '',
      password: '',
    },
    requiresTest: true,
    formComponent: PostgresForm,
  },
  [DB_CONNECTION_TYPES.SQLITE]: {
    label: 'SQLite',
    icon: HardDrive,
    defaultConfig: {
      type: DB_CONNECTION_TYPES.SQLITE,
      path: '',
    },
    requiresTest: false,
    formComponent: SQLiteForm,
  },
} as const
