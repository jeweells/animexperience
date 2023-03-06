import { PayloadAction } from '@reduxjs/toolkit'
import { AnimeInfo } from '../../../globals/types'
import { VideoOption } from '../../../src/components/VideoPlayer'
import { RecentAnimeData } from '../../../src/hooks/useRecentAnimes'
import { Optional } from '../../../src/types'
import { rendererInvoke } from '../../../src/utils'
import { player } from '../player'
import { addFetchFlow, asyncAction, createSlice } from '../utils'
import { WatchState } from '../../state/types'
import { initialState } from '../../state'

const changeWatchingEpisode = (state: WatchState, episode: number): RecentAnimeData => {
    const { info, watching } = state
    return {
        date: watching?.date,
        name: info?.title,
        episode,
        img: info?.image?.replace('/covers/', '/thumbs/') ?? watching?.img,
        link: info?.episodeLink.replace(info?.episodeReplace ?? '', String(episode)),
    }
}

const getAvailableVideos = asyncAction('watch/availableVideos', async (arg, api) => {
    const state = api.getState()
    const anime = state.watch.watching
    if (!anime) {
        return api.rejectWithValue('Needs to be watching to request available videos')
    }
    console.debug('Getting available videos of', anime)
    const FEW_VIDEOS = 3

    const filter = (x: VideoOption) => {
        const opt = x.name?.toLowerCase()
        switch (opt) {
            // IOS: What a horrible option full of ads and annoying stuff
            case 'ios':
                return false
        }
        return true
    }
    const videos = [
        (
            await rendererInvoke(
                'getAnimeFlvEpisodeVideos',
                anime.name,
                anime.episode,
                anime.link,
            )
        ).filter(filter),
    ]
    if (videos[0].length <= FEW_VIDEOS) {
        videos.concat(
            await Promise.all([
                rendererInvoke(
                    'getAnimeIDEpisodeVideos',
                    anime.name,
                    anime.episode,
                    anime.link,
                ),
                rendererInvoke('getJKAnimeEpisodeVideos', anime.name, anime.episode),
            ]),
        )
    }
    return (videos.filter(Array.isArray).flat(1) as VideoOption[]).filter(filter)
})

const getAnimeInfo = asyncAction('watch/getAnimeInfo', async (arg, api) => {
    const state = api.getState()
    const anime = state.watch.watching
    if (!anime) {
        return api.rejectWithValue('Needs to be watching to request available videos')
    }
    console.debug('Getting anime INFO', anime)
    return await rendererInvoke(
        'getAnimeFlvInfo',
        anime.name,
        anime.link
            ?.replace('animeid.tv/v/', 'animeid.tv/')
            .replace('animeflv.net/ver/', 'animeflv.net/anime/')
            .replace(new RegExp(`-${anime.episode}$`), ''),
    )
})

const nextEpisode = asyncAction('watch/nextEpisode', async (arg, api) => {
    const state = api.getState()
    const currentEpisode = state.watch.watching?.episode ?? 0
    const maxEpisode = state.watch.info?.episodesRange?.max ?? 0
    // No episodes available
    if (currentEpisode >= maxEpisode) return
    const watching = state.watch.watching
    if (watching && typeof watching.episode === 'number') {
        const newEpisode = watching.episode + 1
        console.debug('Called next episode, fullscreen:', !!document.fullscreenElement)
        // If the user is on fullscreen mode, the next video will be played on fullscreen mode
        api.dispatch(watch.setAutoFullScreen(!!document.fullscreenElement))
        await api.dispatch(watchEpisode(changeWatchingEpisode(state.watch, newEpisode)))
    }
})

const previousEpisode = asyncAction('watch/previousEpisode', async (arg, api) => {
    const state = api.getState()
    const watching = state.watch.watching
    if (watching && typeof watching.episode === 'number') {
        const newEpisode = watching.episode - 1
        await api.dispatch(watchEpisode(changeWatchingEpisode(state.watch, newEpisode)))
    }
})

const watchEpisode = asyncAction(
    'watch/watchEpisode',
    async (anime: RecentAnimeData, { dispatch }) => {
        dispatch(watch.set(anime))
        const p = dispatch(watch.getAvailableVideos())
        const info = dispatch(watch.getAnimeInfo())
        dispatch(player.show())
        await Promise.all([p, info])
    },
)

export const slice = createSlice({
    name: 'watch',
    reducers: {
        set(state, { payload }: PayloadAction<Optional<RecentAnimeData>>) {
            state.watching = payload
        },
        reset() {
            return initialState.watch
        },
        setNextEpisodeButton(state, { payload }: PayloadAction<boolean>) {
            state.showNextEpisodeButton = payload
            if (!payload) {
                state.nextEpisodeTimeout = -1
            }
        },
        setNextEpisodeTimeout(state, { payload }: PayloadAction<number>) {
            state.nextEpisodeTimeout = payload
        },
        setAutoFullScreen(state, { payload }: PayloadAction<boolean>) {
            state.autoFullScreen = payload
        },
    },
    extraReducers: ({ addCase }) => {
        addFetchFlow(
            addCase,
            getAvailableVideos,
            'availableVideos',
            (state, { payload }: PayloadAction<Optional<VideoOption[]>>) => {
                console.debug('Available videos:', payload)
                state.availableVideos = payload
            },
        )
        addFetchFlow(
            addCase,
            getAnimeInfo,
            'info',
            (state, { payload }: PayloadAction<Optional<AnimeInfo>>) => {
                state.info = payload
            },
        )
        addFetchFlow(addCase, watchEpisode, 'watchEpisode')
    },
})

export const watch = {
    ...slice.actions,
    getAvailableVideos,
    nextEpisode,
    previousEpisode,
    watchEpisode,
    getAnimeInfo,
}
export default slice.reducer
