import type { DBConnectionType } from '@shared/types/db-connection.type'
import { FieldLegend, FieldSet } from '@renderer/components/ui/field'
import { ToggleGroup, ToggleGroupItem } from '@renderer/components/ui/toggle-group'
import { DB_CONNECTION_OPTIONS } from '@renderer/constants/db-connection-options.constant'

interface State {
  value: DBConnectionType
}

interface Actions {
  onValueChange: (type: DBConnectionType) => void
}

type Props = State & Actions

export function ConnectionTypeSelector({ value, onValueChange }: Props) {
  return (
    <FieldSet>
      <FieldLegend>SQL</FieldLegend>

      <ToggleGroup
        orientation="vertical"
        value={[value]}
        onValueChange={(value) => {
          const next = value[0] as DBConnectionType
          if (next) {
            onValueChange(next)
          }
        }}
        className="w-full"
      >
        {DB_CONNECTION_OPTIONS.map(option => (
          <ToggleGroupItem key={option.type} value={option.type} className="justify-start">
            <option.icon className="size-4" />

            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </FieldSet>
  )
}
