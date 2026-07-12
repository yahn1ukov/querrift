import { Button } from '@renderer/components/ui/button'
import { Spinner } from '@renderer/components/ui/spinner'

interface State {
  requiresTest: boolean
  isSubmitting: boolean
  isTesting: boolean
  isTested: boolean
}

interface Actions {
  onTest: () => void
}

type Props = State & Actions

export function ConnectionFormActions({ requiresTest, isSubmitting, isTesting, isTested, onTest }: Props) {
  if (!requiresTest) {
    return (
      <div className="mt-3">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Spinner className="size-4" /> : 'Connect'}
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-3 flex w-full gap-2">
      <Button type="button" variant="outline" className="flex-1" onClick={onTest} disabled={isTesting || isSubmitting}>
        {isTesting ? <Spinner className="size-4" /> : 'Test'}
      </Button>

      <Button type="submit" className="flex-1" disabled={!isTested || isSubmitting}>
        {isSubmitting ? <Spinner className="size-4" /> : 'Connect'}
      </Button>
    </div>
  )
}
