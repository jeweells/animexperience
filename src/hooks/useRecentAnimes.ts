import React from 'react'

const { ipcRenderer } = window.require('electron')

type Status = 'idle' | 'loading' | 'succeeded' | 'failed'
export const useFetch = <T>(url: string) => {
    const [data, setData] = React.useState<T | null>(null)
    const [status, setStatus] = React.useState<Status>('idle')

    React.useLayoutEffect(() => {
        fetch(url)
            .then((r) => r.json())
            .then((r) => {
                setData(r)
                setStatus('succeeded')
            })
            .catch((err) => {
                console.error('While fetching...', err)
            })
    }, [])

    return {
        data,
        status,
    }
}

export const useInnerFetch = <T>(name: string) => {
    const [data, setData] = React.useState<T | null>(null)
    const [status, setStatus] = React.useState<Status>('idle')
    React.useLayoutEffect(() => {
        ipcRenderer
            .invoke(name)
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
