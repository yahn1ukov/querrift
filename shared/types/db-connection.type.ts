import type { DB_CONNECTION_TYPES } from '@shared/constants/db-connection-types.constant'

export type DBConnectionType = (typeof DB_CONNECTION_TYPES)[keyof typeof DB_CONNECTION_TYPES]
