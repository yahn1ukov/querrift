import type { CSSProperties } from 'react'
import { Button } from '@renderer/components/ui/button'
import { ButtonGroup } from '@renderer/components/ui/button-group'
import { useCanGoForward } from '@renderer/hooks/use-can-go-forward.hook'
import { cn } from '@renderer/lib/utils'
import { useCanGoBack, useRouter } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function TitleBar() {
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const canGoForward = useCanGoForward()

  const isMacOS = window.electronAPI.platform === 'darwin'

  return (
    <header
      className="relative z-50 flex h-8 items-center border-b border-border bg-background px-3"
      style={{ WebkitAppRegion: 'drag' } as CSSProperties}
    >
      <nav
        className={cn('z-10', isMacOS && 'ml-18')}
        style={{ WebkitAppRegion: 'no-drag' } as CSSProperties}
      >
        <ButtonGroup>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => router.history.back()}
            disabled={!canGoBack}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => router.history.forward()}
            disabled={!canGoForward}
          >
            <ChevronRight className="size-4" />
          </Button>
        </ButtonGroup>
      </nav>

      <div className="pointer-events-none absolute inset-x-0 mx-auto flex items-center justify-center">
        <span className="text-sm font-semibold text-foreground">Querrift</span>
      </div>
    </header>
  )
}
