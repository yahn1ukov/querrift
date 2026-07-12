import type { IpcRendererEvent } from 'electron'
import { QUERY_KEYS } from '@renderer/constants/query-keys.constant'
import { EVENT_BUS } from '@shared/constants/event-bus.constant'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'

export function useDBConnectionEvents() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const invalidateConnections = () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DB_CONNECTION.ALL })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DB_CONNECTION.ACTIVE })
    }

    const handleRefresh = () => invalidateConnections()
    const handleLost = (_event: IpcRendererEvent, payload: { message: string }) => {
      invalidateConnections()
      toast.error('Connection lost', { description: payload.message })
    }

    window.ipcRenderer.on(EVENT_BUS.DB_CONNECTION.CONNECTED, handleRefresh)
    window.ipcRenderer.on(EVENT_BUS.DB_CONNECTION.DISCONNECTED, handleRefresh)
    window.ipcRenderer.on(EVENT_BUS.DB_CONNECTION.CREATED, handleRefresh)
    window.ipcRenderer.on(EVENT_BUS.DB_CONNECTION.UPDATED, handleRefresh)
    window.ipcRenderer.on(EVENT_BUS.DB_CONNECTION.DELETED, handleRefresh)
    window.ipcRenderer.on(EVENT_BUS.DB_CONNECTION.LOST, handleLost)

    return () => {
      window.ipcRenderer.off(EVENT_BUS.DB_CONNECTION.CONNECTED, handleRefresh)
      window.ipcRenderer.off(EVENT_BUS.DB_CONNECTION.DISCONNECTED, handleRefresh)
      window.ipcRenderer.off(EVENT_BUS.DB_CONNECTION.CREATED, handleRefresh)
      window.ipcRenderer.off(EVENT_BUS.DB_CONNECTION.UPDATED, handleRefresh)
      window.ipcRenderer.off(EVENT_BUS.DB_CONNECTION.DELETED, handleRefresh)
      window.ipcRenderer.off(EVENT_BUS.DB_CONNECTION.LOST, handleLost)
    }
  }, [queryClient])
}
