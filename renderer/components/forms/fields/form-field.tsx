import type { ReactNode } from 'react'
import type { Control, ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form'
import { Field, FieldDescription, FieldError, FieldLabel } from '@renderer/components/ui/field'
import { Controller } from 'react-hook-form'

interface State<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  description?: string
  className?: string
}

interface Actions<TFieldValues extends FieldValues> {
  children: (field: ControllerRenderProps<TFieldValues>, invalid: boolean) => ReactNode
}

type Props<TFieldValues extends FieldValues> = State<TFieldValues> & Actions<TFieldValues>

export function FormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  children,
}: Props<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: state }) => (
        <Field data-invalid={state.invalid} className={className}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

          {children(field, state.invalid)}

          {description && <FieldDescription>{description}</FieldDescription>}

          {state.invalid && <FieldError errors={[state.error]} />}
        </Field>
      )}
    />
  )
}
