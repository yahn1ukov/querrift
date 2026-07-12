import { ConnectionsCreatePage } from '@renderer/pages/ConnectionsCreatePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/connections/create')({
  component: ConnectionsCreatePage,
})
