const DB_CONNECTION_KEYS = {
  ALL: ['db-connections'] as const,
  LIST: () => [...DB_CONNECTION_KEYS.ALL, 'list'] as const,
  ACTIVE: () => [...DB_CONNECTION_KEYS.ALL, 'active'] as const,
  DETAIL: (id: string) => [...DB_CONNECTION_KEYS.ALL, 'detail', id] as const,
} as const

export const QUERY_KEYS = {
  DB_CONNECTION: DB_CONNECTION_KEYS,
} as const
