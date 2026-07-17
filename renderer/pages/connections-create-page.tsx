import type { CreateDBConnectionDTO } from '@shared/dtos/db-connection.dto'
import type { DBConnectionType } from '@shared/types/db-connection.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField } from '@renderer/components/forms/fields/text-field'
import { Button } from '@renderer/components/ui/button'
import { FieldGroup, FieldLegend, FieldSet } from '@renderer/components/ui/field'
import { Spinner } from '@renderer/components/ui/spinner'
import { ToggleGroup, ToggleGroupItem } from '@renderer/components/ui/toggle-group'
import { DB_CONNECTION_OPTIONS } from '@renderer/constants/db-connection-options.constant'
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
  const testMutation = useTestConnection()
  const createMutation = useCreateConnection()

  async function onTest() {
    const isValid = await form.trigger('config')
    if (!isValid) {
      return
    }

    const isPassed = await testMutation.mutateAsync(form.getValues('config'))
    setIsTested(isPassed)
  }

  async function onSubmit(dto: CreateDBConnectionDTO) {
    if (requiresTest && !isTested) {
      toast.error('Test the connection before connecting')
      return
    }

    createMutation.mutate(dto, {
      onSuccess: () => navigate({ to: '/' }),
    })
  }

  return (
    <div className="h-full flex">
      <aside className="w-56 shrink-0 border-r border-border p-3">
        <FieldSet>
          <FieldLegend>SQL</FieldLegend>

          <ToggleGroup
            orientation="vertical"
            className="w-full"
            value={[selectedDBConnectionType]}
            onValueChange={(value) => {
              const type = value[0] as DBConnectionType
              if (type) {
                form.reset({
                  name: form.getValues('name'),
                  config: DB_CONNECTION_REGISTRY[type].defaultConfig,
                })
                setIsTested(false)
              }
            }}
          >
            {DB_CONNECTION_OPTIONS.map(option => (
              <ToggleGroupItem key={option.type} value={option.type} className="justify-start">
                <option.icon className="size-4" />
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </FieldSet>
      </aside>

      <div className="min-w-0 flex-1 overflow-y-auto p-3">
        <header className="mb-4">
          <h1 className="text-lg font-semibold tracking-tight">New connection</h1>
        </header>

        <FormProvider {...form}>
          <form className="max-w-xs" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <TextField control={form.control} name="name" label="Name" placeholder="My database" />

              <ConnectionForm />
            </FieldGroup>

            {!requiresTest
              ? (
                  <div className="mt-3">
                    <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                      {createMutation.isPending ? <Spinner className="size-4" /> : 'Connect'}
                    </Button>
                  </div>
                )
              : (
                  <div className="mt-3 flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      disabled={testMutation.isPending || createMutation.isPending}
                      onClick={onTest}
                    >
                      {testMutation.isPending ? <Spinner className="size-4" /> : 'Test'}
                    </Button>

                    <Button type="submit" className="flex-1" disabled={!isTested || createMutation.isPending}>
                      {createMutation.isPending ? <Spinner className="size-4" /> : 'Connect'}
                    </Button>
                  </div>
                )}
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
