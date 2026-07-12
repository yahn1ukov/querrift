import { ConnectionListItem } from '@renderer/components/ConnectionListItem'
import { Button } from '@renderer/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@renderer/components/ui/empty'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@renderer/components/ui/input-group'
import { ItemGroup } from '@renderer/components/ui/item'
import { Spinner } from '@renderer/components/ui/spinner'
import { useConnectConnection, useDeleteConnection, useGetConnections, useUpdateConnection } from '@renderer/hooks/use-connections.hook'
import { useNavigate } from '@tanstack/react-router'
import { Database, Plus, Search } from 'lucide-react'
import { useState } from 'react'

export function HomePage() {
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [editingConnectionId, setEditingConnectionId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const { data: connections = [], isLoading } = useGetConnections()
  const connectConnection = useConnectConnection()
  const deleteConnection = useDeleteConnection()
  const updateConnection = useUpdateConnection()

  const filteredConnections = connections.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  function startEditing(id: string) {
    const connection = connections.find(connection => connection.id === id)
    if (!connection) {
      return
    }

    setEditingConnectionId(id)
    setEditingName(connection.name)
  }

  function resetEditing() {
    setEditingConnectionId(null)
    setEditingName('')
  }

  function saveEditing(id: string) {
    const name = editingName.trim()
    if (!name) {
      return
    }

    updateConnection.mutate({ id, dto: { name } }, { onSuccess: resetEditing })
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-3">
      <div className="relative mb-3 flex shrink-0 justify-end">
        <InputGroup className="absolute left-1/2 top-1/2 w-full max-w-xs -translate-x-1/2 -translate-y-1/2">
          <InputGroupAddon>
            <Search className="size-4" aria-hidden="true" />
          </InputGroupAddon>

          <InputGroupInput
            type="text"
            placeholder="Search connections..."
            aria-label="Search connections"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            disabled={connections.length === 0}
          />
        </InputGroup>

        <Button onClick={() => navigate({ to: '/connections/create' })}>
          <Plus className="size-4" />
          New Connection
        </Button>
      </div>

      {isLoading && (
        <div className="grid flex-1 place-items-center">
          <Spinner className="size-10" />
        </div>
      )}

      {!isLoading && connections.length === 0 && (
        <div className="grid flex-1 place-items-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Database />
              </EmptyMedia>
              <EmptyTitle>No database connections found</EmptyTitle>
              <EmptyDescription>Create your first connection to start managing your database</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      )}

      {!isLoading && connections.length > 0 && (
        filteredConnections.length === 0
          ? (
              <div className="grid flex-1 place-items-center text-sm text-muted-foreground">
                No connections match your search
              </div>
            )
          : (
              <ItemGroup className="flex flex-col gap-2">
                {filteredConnections.map(connection => (
                  <ConnectionListItem
                    key={connection.id}
                    connection={connection}
                    isRunning={connectConnection.isPending && connectConnection.variables === connection.id}
                    isDeleting={deleteConnection.isPending && deleteConnection.variables === connection.id}
                    isEditing={editingConnectionId === connection.id}
                    editName={editingName}
                    onRun={id => connectConnection.mutate(id)}
                    onEdit={startEditing}
                    onEditCancel={resetEditing}
                    onEditNameChange={setEditingName}
                    onEditSave={saveEditing}
                    onDelete={id => deleteConnection.mutate(id)}
                  />
                ))}
              </ItemGroup>
            )
      )}
    </div>
  )
}
