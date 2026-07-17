import { TitleBar } from '@renderer/components/title-bar'
import { Toaster } from '@renderer/components/ui/sonner'
import { useDBConnectionEvents } from '@renderer/hooks/use-db-connection-events.hook'
import { Outlet } from '@tanstack/react-router'

export function RootLayout() {
  useDBConnectionEvents()

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background font-sans text-foreground antialiased select-none">
      <TitleBar />

      <main className="min-h-0 flex flex-1 flex-col">
        <Outlet />
      </main>

      <Toaster position="top-right" offset="12px" richColors />
    </div>
  )
}
