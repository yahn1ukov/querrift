import type { DBConnectionDTO } from '@shared/dtos/db-connection.dto'
import type { SubmitEvent } from 'react'
import { Button } from '@renderer/components/ui/button'
import { ButtonGroup } from '@renderer/components/ui/button-group'
import { Input } from '@renderer/components/ui/input'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@renderer/components/ui/item'
import { Spinner } from '@renderer/components/ui/spinner'
import { useConnectConnection, useDeleteConnection, useDisconnectConnection, useGetActiveConnection, useUpdateConnection } from '@renderer/hooks/use-connections.hook'
import { Check, Pause, Pencil, Play, Trash, X } from 'lucide-react'
import { useState } from 'react'

interface Props {
  connection: DBConnectionDTO
}

export function ConnectionListItem({ connection }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(connection.name)

  const { data: activeConnection } = useGetActiveConnection()
  const connectMutation = useConnectConnection()
  const disconnectMutation = useDisconnectConnection()
  const updateMutation = useUpdateConnection()
  const deleteMutation = useDeleteConnection()

  const isPending = connectMutation.isPending || disconnectMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  const isConnected = activeConnection === connection.id

  const onCancel = () => {
    setEditName(connection.name)
    setIsEditing(false)
  }

  const onSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const name = editName.trim()
    if (!name || name === connection.name) {
      onCancel()
      return
    }

    updateMutation.mutate(
      { id: connection.id, dto: { name } },
      { onSuccess: () => setIsEditing(false) },
    )
  }

  return (
    <Item variant="outline">
      <ItemContent className="gap-1">
        {isEditing
          ? (
              <form onSubmit={onSubmit} className="flex flex-1 items-center gap-2">
                <Input
                  name="name"
                  value={editName}
                  onChange={event => setEditName(event.target.value)}
                  disabled={isPending}
                />

                <ButtonGroup>
                  <Button
                    type="submit"
                    variant="outline"
                    size="icon"
                    disabled={isPending}
                  >
                    {updateMutation.isPending ? <Spinner className="size-4" /> : <Check className="size-4" />}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onCancel}
                    disabled={isPending}
                  >
                    <X className="size-4" />
                  </Button>
                </ButtonGroup>
              </form>
            )
          : (
              <>
                <ItemTitle>{connection.name}</ItemTitle>

                <ItemDescription>{connection.type}</ItemDescription>
              </>
            )}
      </ItemContent>

      {!isEditing && (
        <ItemActions>
          <ButtonGroup>
            {isConnected
              ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => disconnectMutation.mutate()}
                    disabled={isPending}
                  >
                    {disconnectMutation.isPending ? <Spinner className="size-4" /> : <Pause className="size-4" />}
                  </Button>
                )
              : (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => connectMutation.mutate(connection.id)}
                    disabled={isPending}
                  >
                    {connectMutation.isPending ? <Spinner className="size-4" /> : <Play className="size-4" />}
                  </Button>
                )}

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setIsEditing(true)}
              disabled={isPending}
            >
              <Pencil className="size-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => deleteMutation.mutate(connection.id)}
              disabled={isPending}
            >
              {deleteMutation.isPending ? <Spinner className="size-4" /> : <Trash className="size-4" />}
            </Button>
          </ButtonGroup>
        </ItemActions>
      )}
    </Item>
  )
}
