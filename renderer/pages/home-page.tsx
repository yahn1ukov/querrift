import { ConnectionListItem } from '@renderer/components/connection-list-item'
import { Button } from '@renderer/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@renderer/components/ui/empty'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@renderer/components/ui/input-group'
import { ItemGroup } from '@renderer/components/ui/item'
import { Spinner } from '@renderer/components/ui/spinner'
import { useGetConnections } from '@renderer/hooks/use-connections.hook'
import { useNavigate } from '@tanstack/react-router'
import { Database, Plus, Search } from 'lucide-react'
import { useState } from 'react'

export function HomePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const { data: connections = [], isLoading } = useGetConnections()

  const filteredConnections = connections.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-3">
      <div className="mb-3 flex items-center gap-3">
        <InputGroup>
          <InputGroupAddon>
            <Search className="size-4" aria-hidden="true" />
          </InputGroupAddon>

          <InputGroupInput
            type="text"
            placeholder="Search connections..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            disabled={!connections.length}
          />
        </InputGroup>

        <Button type="button" onClick={() => navigate({ to: '/connections/create' })}>
          <Plus className="size-4" />
          New Connection
        </Button>
      </div>

      {isLoading && (
        <div className="grid flex-1 place-items-center">
          <Spinner className="size-10" />
        </div>
      )}

      {!isLoading && !connections.length && (
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
        !filteredConnections.length
          ? (
              <div className="grid place-items-center">
                <span className="text-sm text-muted-foreground">No connections match your search</span>
              </div>
            )
          : (
              <ItemGroup className="flex flex-col gap-2">
                {filteredConnections.map(c => (
                  <ConnectionListItem key={c.id} connection={c} />
                ))}
              </ItemGroup>
            )
      )}
    </div>
  )
}
