import type { CreateDBConnectionDTO } from '@shared/dtos/db-connection.dto'
import { TextField } from '@renderer/components/forms/fields/text-field'
import { FieldGroup } from '@renderer/components/ui/field'
import { useFormContext } from 'react-hook-form'

export function PostgresForm() {
  const { control } = useFormContext<CreateDBConnectionDTO>()

  return (
    <>
      <FieldGroup className="grid grid-cols-3 gap-3">
        <TextField control={control} name="config.host" label="Host" placeholder="localhost" className="col-span-2" />

        <TextField control={control} name="config.port" label="Port" type="number" />
      </FieldGroup>

      <TextField control={control} name="config.database" label="Database" />

      <TextField control={control} name="config.user" label="User" />

      <TextField control={control} name="config.password" label="Password" type="password" />
    </>
  )
}
