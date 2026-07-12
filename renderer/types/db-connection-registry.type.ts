import type { CreateDBConnectionDTO } from '@shared/dtos/db-connection.dto'
import type { LucideIcon } from 'lucide-react'
import type { FunctionComponent } from 'react'

export interface DBConnectionRegistry {
  label: string
  icon: LucideIcon
  defaultConfig: CreateDBConnectionDTO['config']
  requiresTest: boolean
  formComponent: FunctionComponent
}
