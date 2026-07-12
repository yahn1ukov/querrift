import { homedir } from 'node:os'
import { join } from 'node:path'

const APP_DIR = join(homedir(), 'Querrift')

export const FILE_PATHS = {
  CONNECTIONS: join(APP_DIR, 'connections.json'),
} as const
