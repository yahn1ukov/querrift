const CONNECTION = {
  CONNECT: 'connection:connect',
  DISCONNECT: 'connection:disconnect',
  TEST: 'connection:test',
  CREATE: 'connection:create',
  GET_ALL: 'connection:getAll',
  GET: 'connection:get',
  UPDATE: 'connection:update',
  DELETE: 'connection:delete',
  IMPORT: 'connection:import',
  EXPORT: 'connection:export',
} as const

export const IPC = {
  CONNECTION,
} as const
