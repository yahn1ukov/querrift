export function assertUnreachable(value: never): never {
  const type = typeof value === 'object' && value !== null && 'type' in value
    ? String((value as { type: unknown }).type)
    : 'unknown'

  throw new Error(`Unhandled case: ${type}`)
}
