import { useRouter, useRouterState } from '@tanstack/react-router'

export function useCanGoForward() {
  const router = useRouter()
  const routerState = useRouterState()

  const index = routerState.location.state.__TSR_index ?? 0
  return index < router.history.length - 1
}
