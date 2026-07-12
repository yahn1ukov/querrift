import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { FormField } from '@renderer/components/forms/fields/FormField'
import { Input } from '@renderer/components/ui/input'

interface Props<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  type?: 'text' | 'password' | 'number'
  placeholder?: string
  className?: string
}

export function TextField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  type = 'text',
  placeholder,
  className,
}: Props<TFieldValues>) {
  return (
    <FormField control={control} name={name} label={label} className={className}>
      {(field, invalid) => (
        <Input
          {...field}
          id={field.name}
          type={type}
          placeholder={placeholder}
          aria-invalid={invalid}
          onChange={e => field.onChange(type === 'number' ? e.target.valueAsNumber : e.target.value)}
        />
      )}
    </FormField>
  )
}
