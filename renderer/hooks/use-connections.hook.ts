import type { CreateDBConnectionDTO, UpdateDBConnectionDTO } from '@shared/dtos/db-connection.dto'
import { ipcClient } from '@renderer/api/ipc-client'
import { QUERY_KEYS } from '@renderer/constants/query-keys.constant'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

function useInvalidateConnections() {
  const queryClient = useQueryClient()

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DB_CONNECTION.ALL }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DB_CONNECTION.ACTIVE }),
    ])
}

export function useConnectConnection() {
  const invalidateConnections = useInvalidateConnections()

  return useMutation({
    mutationFn: (id: string) => ipcClient.dbConnection.connect(id),
    onSuccess: async () => {
      await invalidateConnections()

      toast.success('Connected')
    },
  })
}

export function useTestConnection() {
  return useMutation({
    mutationFn: (config: CreateDBConnectionDTO['config']) => ipcClient.dbConnection.test(config),
    onSuccess: (isValid) => {
      if (isValid) {
        toast.success('Connection test passed')
        return
      }

      toast.error('Connection test failed')
    },
  })
}

export function useCreateConnection() {
  const invalidateConnections = useInvalidateConnections()

  return useMutation({
    mutationFn: (dto: CreateDBConnectionDTO) => ipcClient.dbConnection.create(dto),
    onSuccess: async () => {
      await invalidateConnections()

      toast.success('Connection created')
    },
  })
}

export function useGetConnections() {
  return useQuery({
    queryKey: QUERY_KEYS.DB_CONNECTION.ALL,
    queryFn: ipcClient.dbConnection.getAll,
  })
}

export function useGetActiveConnection() {
  return useQuery({
    queryKey: QUERY_KEYS.DB_CONNECTION.ACTIVE,
    queryFn: ipcClient.dbConnection.getActive,
  })
}

export function useGetConnection(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.DB_CONNECTION.DETAIL(id),
    queryFn: () => ipcClient.dbConnection.get(id),
    enabled: Boolean(id),
  })
}

export function useUpdateConnection() {
  const queryClient = useQueryClient()
  const invalidateConnections = useInvalidateConnections()

  return useMutation({
    mutationFn: ({ id, dto }: { id: string, dto: UpdateDBConnectionDTO }) => ipcClient.dbConnection.update(id, dto),
    onSuccess: async (_, { id }) => {
      await Promise.all([
        invalidateConnections(),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DB_CONNECTION.DETAIL(id) }),
      ])

      toast.success('Connection updated')
    },
  })
}

export function useDeleteConnection() {
  const invalidateConnections = useInvalidateConnections()

  return useMutation({
    mutationFn: (id: string) => ipcClient.dbConnection.delete(id),
    onSuccess: async () => {
      await invalidateConnections()

      toast.success('Connection deleted')
    },
  })
}
