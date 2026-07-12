const DB_CONNECTION_EVENTS = {
  CONNECT: 'connection:connect',
  DISCONNECT: 'connection:disconnect',
  TEST: 'connection:test',
  CREATE: 'connection:create',
  GET_ALL: 'connection:get:all',
  GET_ACTIVE: 'connection:get:active',
  GET: 'connection:get',
  UPDATE: 'connection:update',
  DELETE: 'connection:delete',
  IMPORT: 'connection:import',
  EXPORT: 'connection:export',
} as const

export const EVENT_IPC = {
  DB_CONNECTION: DB_CONNECTION_EVENTS,
} as const
