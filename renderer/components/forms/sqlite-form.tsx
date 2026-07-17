import type { CreateDBConnectionDTO } from '@shared/dtos/db-connection.dto'
import { FileField } from '@renderer/components/forms/fields/file-field'
import { useFormContext } from 'react-hook-form'

export function SQLiteForm() {
  const { control } = useFormContext<CreateDBConnectionDTO>()

  return (
    <FileField
      control={control}
      name="config.path"
      label="File"
      accept=".db,.sqlite,.sqlite3,.db3,.s3db,.sl3,.sdb"
      onSelect={file => window.electronAPI.getPathForFile(file)}
    />
  )
}
