import React from 'react'
import invokeNames from '../../electron/invokeNames'
import { rendererInvoke } from '../utils'

type Status = 'idle' | 'loading' | 'succeeded' | 'failed'

export const useInnerFetch = <T>(name: keyof typeof invokeNames) => {
    const [data, setData] = React.useState<T | null>(null)
    const [status, setStatus] = React.useState<Status>('idle')
    React.useLayoutEffect(() => {
        rendererInvoke(name)
            .then((x) => {
                setData(x)
                setStatus('succeeded')
            })
            .catch(console.error)
    }, [])
    return {
        data,
        status,
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
