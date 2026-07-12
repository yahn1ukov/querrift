import type { DBConnectionDTO } from '@shared/dtos/db-connection.dto'
import { Button } from '@renderer/components/ui/button'
import { ButtonGroup } from '@renderer/components/ui/button-group'
import { Input } from '@renderer/components/ui/input'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@renderer/components/ui/item'
import { Spinner } from '@renderer/components/ui/spinner'
import { Check, Pencil, Play, Trash, X } from 'lucide-react'

interface State {
  connection: DBConnectionDTO
  isDeleting?: boolean
  isEditing?: boolean
  isRunning?: boolean
  editName?: string
}

interface Actions {
  onRun: (id: string) => void
  onEdit: (id: string) => void
  onEditCancel?: () => void
  onEditNameChange?: (name: string) => void
  onEditSave?: (id: string) => void
  onDelete: (id: string) => void
}

type Props = State & Actions

export function ConnectionListItem({
  connection,
  editName,
  isDeleting = false,
  isEditing = false,
  isRunning = false,
  onRun,
  onEdit,
  onEditCancel,
  onEditNameChange,
  onEditSave,
  onDelete,
}: Props) {
  return (
    <Item variant="outline">
      <ItemContent className="gap-1">
        {isEditing
          ? (
              <Input
                value={editName}
                aria-label="Connection name"
                onChange={event => onEditNameChange?.(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    onEditSave?.(connection.id)
                  }

                  if (event.key === 'Escape') {
                    onEditCancel?.()
                  }
                }}
              />
            )
          : (
              <ItemTitle>{connection.name}</ItemTitle>
            )}

        <ItemDescription>{connection.type}</ItemDescription>
      </ItemContent>

      <ItemActions>
        <ButtonGroup>
          {isEditing
            ? (
                <>
                  <Button variant="outline" size="icon" aria-label="Save connection name" onClick={() => onEditSave?.(connection.id)}>
                    <Check className="size-4" />
                  </Button>

                  <Button variant="outline" size="icon" aria-label="Cancel editing connection name" onClick={onEditCancel}>
                    <X className="size-4" />
                  </Button>
                </>
              )
            : (
                <>
                  <Button variant="outline" size="icon" aria-label="Run connection" onClick={() => onRun(connection.id)} disabled={isRunning}>
                    {isRunning ? <Spinner className="size-4" /> : <Play className="size-4" />}
                  </Button>

                  <Button variant="outline" size="icon" aria-label="Edit connection" onClick={() => onEdit(connection.id)}>
                    <Pencil className="size-4" />
                  </Button>

                  <Button variant="outline" size="icon" aria-label="Delete connection" onClick={() => onDelete(connection.id)} disabled={isDeleting}>
                    {isDeleting ? <Spinner className="size-4" /> : <Trash className="size-4" />}
                  </Button>
                </>
              )}
        </ButtonGroup>
      </ItemActions>
    </Item>
  )
}
