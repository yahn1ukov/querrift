import { routeTree } from '@renderer/routes/generated/route-tree.gen'
import { createHashHistory, createRouter } from '@tanstack/react-router'

export const router = createRouter({
  routeTree,
  history: createHashHistory(),
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
