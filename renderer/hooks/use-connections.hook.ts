import type { CreateDBConnectionDTO, UpdateDBConnectionDTO } from '@shared/dtos/db-connection.dto'
import { ipcClient } from '@renderer/api/ipc-client'
import { QUERY_KEYS } from '@renderer/constants/query-keys.constant'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useConnectConnection() {
  return useMutation({
    mutationFn: (id: string) => ipcClient.dbConnection.connect(id),
    onSuccess: () => {
      toast.success('Connected')
    },
  })
}

export function useDisconnectConnection() {
  return useMutation({
    mutationFn: () => ipcClient.dbConnection.disconnect(),
    onSuccess: () => {
      toast.success('Disconnected')
    },
  })
}

export function useTestConnection() {
  return useMutation({
    mutationFn: (config: CreateDBConnectionDTO['config']) => ipcClient.dbConnection.test(config),
    onSuccess: (isValid) => {
      if (isValid) {
        toast.success('Connection test passed')
      }
      else {
        toast.error('Connection test failed')
      }
    },
  })
}

export function useCreateConnection() {
  return useMutation({
    mutationFn: (dto: CreateDBConnectionDTO) => ipcClient.dbConnection.create(dto),
    onSuccess: () => {
      toast.success('Connection created')
    },
  })
}

export function useGetConnections() {
  return useQuery({
    queryKey: QUERY_KEYS.DB_CONNECTION.LIST(),
    queryFn: ipcClient.dbConnection.getAll,
  })
}

export function useGetActiveConnection() {
  return useQuery({
    queryKey: QUERY_KEYS.DB_CONNECTION.ACTIVE(),
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
  return useMutation({
    mutationFn: ({ id, dto }: { id: string, dto: UpdateDBConnectionDTO }) =>
      ipcClient.dbConnection.update(id, dto),
    onSuccess: () => {
      toast.success('Connection updated')
    },
  })
}

export function useDeleteConnection() {
  return useMutation({
    mutationFn: (id: string) => ipcClient.dbConnection.delete(id),
    onSuccess: () => {
      toast.success('Connection deleted')
    },
  })
}
