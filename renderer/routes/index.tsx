import { HomePage } from '@renderer/pages/home-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})
