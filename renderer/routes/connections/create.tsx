import { ConnectionsCreatePage } from '@renderer/pages/connections-create-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/connections/create')({
  component: ConnectionsCreatePage,
})
