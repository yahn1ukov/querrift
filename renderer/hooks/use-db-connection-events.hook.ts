import type { IpcRendererEvent } from 'electron'
import { QUERY_KEYS } from '@renderer/constants/query-keys.constant'
import { EVENT_BUS } from '@shared/constants/event-bus.constant'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'

export function useDBConnectionEvents() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const invalidateAll = () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DB_CONNECTION.ALL })
    }

    const handleLost = (_event: IpcRendererEvent, payload: { message: string }) => {
      invalidateAll()
      toast.error('Connection lost', {
        description: payload.message,
      })
    }

    window.ipcRenderer.on(EVENT_BUS.DB_CONNECTION.CONNECTED, invalidateAll)
    window.ipcRenderer.on(EVENT_BUS.DB_CONNECTION.DISCONNECTED, invalidateAll)
    window.ipcRenderer.on(EVENT_BUS.DB_CONNECTION.CREATED, invalidateAll)
    window.ipcRenderer.on(EVENT_BUS.DB_CONNECTION.UPDATED, invalidateAll)
    window.ipcRenderer.on(EVENT_BUS.DB_CONNECTION.DELETED, invalidateAll)
    window.ipcRenderer.on(EVENT_BUS.DB_CONNECTION.LOST, handleLost)

    return () => {
      window.ipcRenderer.off(EVENT_BUS.DB_CONNECTION.CONNECTED, invalidateAll)
      window.ipcRenderer.off(EVENT_BUS.DB_CONNECTION.DISCONNECTED, invalidateAll)
      window.ipcRenderer.off(EVENT_BUS.DB_CONNECTION.CREATED, invalidateAll)
      window.ipcRenderer.off(EVENT_BUS.DB_CONNECTION.UPDATED, invalidateAll)
      window.ipcRenderer.off(EVENT_BUS.DB_CONNECTION.DELETED, invalidateAll)
      window.ipcRenderer.off(EVENT_BUS.DB_CONNECTION.LOST, handleLost)
    }
  }, [queryClient])
}
