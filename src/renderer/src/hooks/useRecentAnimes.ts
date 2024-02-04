import * as React from 'react'
import { rendererInvoke } from '../utils'
import { error } from '@dev/events'

type Status = 'idle' | 'loading' | 'succeeded' | 'failed'

export const useInnerFetch = <T>(name: keyof typeof window.invokeNames) => {
  const [data, setData] = React.useState<T | null>(null)
  const [status, setStatus] = React.useState<Status>('idle')
  React.useEffect(() => {
    // TODO: Refetching is not implemented yet since it has no use for now
    rendererInvoke(name)
      .then((x) => {
        setData(x)
        setStatus('succeeded')
      })
      .catch(error)
  }, [])
  return {
    data,
    status
  }
}

export type RecentAnimeData = Partial<{
  name: string
  episode: number
  img: string
  link: string
  date: string
}>

export const useRecentAnimes = () => {
  return useInnerFetch<Array<Array<RecentAnimeData>>>('getRecentAnimes')
}
