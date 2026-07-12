import { TitleBar } from '@renderer/components/TitleBar'
import { Toaster } from '@renderer/components/ui/sonner'
import { useDBConnectionEvents } from '@renderer/hooks/use-db-connection-events.hook'
import { Outlet } from '@tanstack/react-router'

export function RootLayout() {
  useDBConnectionEvents()

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground select-none font-sans antialiased">
      <TitleBar />

      <main className="flex-1 flex flex-col overflow-hidden min-h-0 relative">
        <Outlet />
      </main>

      <Toaster position="top-right" offset="12px" richColors />
    </div>
  )
}
