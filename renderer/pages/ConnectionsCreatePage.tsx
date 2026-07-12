import type { CreateDBConnectionDTO } from '@shared/dtos/db-connection.dto'
import { zodResolver } from '@hookform/resolvers/zod'
import { ConnectionFormActions } from '@renderer/components/ConnectionFormActions'
import { ConnectionTypeSelector } from '@renderer/components/ConnectionTypeSelector'
import { TextField } from '@renderer/components/forms/fields/TextField'
import { FieldGroup } from '@renderer/components/ui/field'
import { DB_CONNECTION_REGISTRY } from '@renderer/constants/db-connection-registry.constant'
import { useCreateConnection, useTestConnection } from '@renderer/hooks/use-connections.hook'
import { DB_CONNECTION_TYPES } from '@shared/constants/db-connection-types.constant'
import { CreateDBConnectionSchema } from '@shared/schemas/db-connection.schema'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

export function ConnectionsCreatePage() {
  const form = useForm<CreateDBConnectionDTO>({
    resolver: zodResolver(CreateDBConnectionSchema),
    defaultValues: {
      name: '',
      config: DB_CONNECTION_REGISTRY[DB_CONNECTION_TYPES.POSTGRES].defaultConfig,
    },
  })

  const selectedDBConnectionType = useWatch({
    control: form.control,
    name: 'config.type',
  })
  const { formComponent: ConnectionForm, requiresTest } = DB_CONNECTION_REGISTRY[selectedDBConnectionType]

  const [isTested, setIsTested] = useState(false)

  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      if (name?.startsWith('config')) {
        setIsTested(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  const navigate = useNavigate()
  const testConnection = useTestConnection()
  const createConnection = useCreateConnection()

  async function onTest() {
    const isValid = await form.trigger('config')
    if (!isValid) {
      return
    }

    const passed = await testConnection.mutateAsync(form.getValues('config'))
    setIsTested(passed)
  }

  async function onSubmit(dto: CreateDBConnectionDTO) {
    if (requiresTest && !isTested) {
      toast.error('Test the connection before connecting')
      return
    }

    await createConnection.mutateAsync(dto)

    await navigate({ to: '/' })
  }

  return (
    <div className="flex h-full">
      <aside className="w-56 shrink-0 border-r border-border p-3">
        <ConnectionTypeSelector
          value={selectedDBConnectionType}
          onValueChange={(type) => {
            form.reset({
              name: form.getValues('name'),
              config: DB_CONNECTION_REGISTRY[type].defaultConfig,
            })
            setIsTested(false)
          }}
        />
      </aside>

      <div className="min-w-0 flex-1 overflow-y-auto p-3">
        <header className="mb-4">
          <h1 className="text-lg font-semibold">New connection</h1>
        </header>

        <FormProvider {...form}>
          <form className="max-w-xs" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <TextField control={form.control} name="name" label="Name" placeholder="My database" />

              <ConnectionForm />
            </FieldGroup>

            <ConnectionFormActions
              requiresTest={requiresTest}
              isTested={isTested}
              isTesting={testConnection.isPending}
              isSubmitting={createConnection.isPending}
              onTest={onTest}
            />
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
