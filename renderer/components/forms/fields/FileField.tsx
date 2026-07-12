import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { FormField } from '@renderer/components/forms/fields/FormField'
import { Input } from '@renderer/components/ui/input'

interface State<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  accept?: string
  description?: string
}

interface Actions {
  onClick: (file: File) => string
}

type Props<TFieldValues extends FieldValues> = State<TFieldValues> & Actions

export function FileField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  accept,
  description,
  onClick,
}: Props<TFieldValues>) {
  return (
    <FormField control={control} name={name} label={label} description={description}>
      {(field, invalid) => (
        <Input
          id={field.name}
          name={field.name}
          type="file"
          className="cursor-pointer"
          accept={accept}
          aria-invalid={invalid}
          onBlur={field.onBlur}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              field.onChange(onClick(file))
            }
          }}
        />
      )}
    </FormField>
  )
}
