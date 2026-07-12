const DB_CONNECTION_KEYS = {
  ALL: ['db-connections'] as const,
  ACTIVE: ['db-connections', 'active'] as const,
  DETAIL: (id: string) => ['db-connections', 'detail', id] as const,
} as const

export const QUERY_KEYS = {
  DB_CONNECTION: DB_CONNECTION_KEYS,
} as const
