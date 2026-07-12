const DB_CONNECTION_EVENTS = {
  CONNECTED: 'connection:connected',
  DISCONNECTED: 'connection:disconnected',
  LOST: 'connection:lost',
  CREATED: 'connection:created',
  UPDATED: 'connection:updated',
  DELETED: 'connection:deleted',
} as const

export const EVENT_BUS = {
  DB_CONNECTION: DB_CONNECTION_EVENTS,
} as const
