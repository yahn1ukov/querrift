const CONNECTION = {
  CONNECTED: 'connection:connected',
  DISCONNECTED: 'connection:disconnected',
  CREATED: 'connection:created',
  UPDATED: 'connection:updated',
  DELETED: 'connection:deleted',
} as const

export const EVENT_BUS = {
  CONNECTION,
} as const
