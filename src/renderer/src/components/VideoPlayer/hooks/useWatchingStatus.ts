import { RecentAnimeData } from '@renderer/hooks/useRecentAnimes'
import { eventNames } from '@shared/constants'
import { startWatchingInfo } from '@shared/schemas'
import { Optional, StartWatchingInfo } from '@shared/types'
import { useEffect, useState } from 'react'

const ipcRenderer = window.electron.ipcRenderer

export const useWatchingStatus = (watching: Optional<RecentAnimeData>) => {
  const startedAt = useState(() => Math.floor(Date.now() / 1000))[0]

  useEffect(() => {
    if (!watching) return
    const name = watching.name
    const episode = watching.episode

    const parsed = startWatchingInfo.safeParse({
      startAt: startedAt,
      episode,
      name
    } satisfies Partial<StartWatchingInfo>)

    if (!parsed.success) return

    ipcRenderer.invoke(eventNames.startWatching, parsed.data)
  }, [watching])

  useEffect(() => {
    return () => {
      ipcRenderer.invoke(eventNames.stopWatching)
    }
  }, [])
}
