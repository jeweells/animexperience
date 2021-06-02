import $ from 'jquery'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { EpisodeInfo, Store } from '../../../globals/types'
import { watch } from '../../../redux/reducers/watch'
import store, { useAppDispatch } from '../../../redux/store'
import { useStaticStore } from '../../hooks/useStaticStore'
import { Optional } from '../../types'
import NextEpisodeButton from '../NextEpisodeButton'
import { handleSpecificOptions } from './autoPlayHandlers'
import {
    SECONDS_LEFT_TO_NEXT_EPISODE,
    SECONDS_LEFT_TO_TRIGGER_NEXT_EPISODE,
    SECONDS_NEXT_BUTTON_DISPLAY,
} from './constants'
import { handleSeek } from './seekHandlers'
import { BasicVideoInfo } from './types'
import { deepFindVideos } from './utils'

export const useVideo = (info: BasicVideoInfo, container: Optional<HTMLDivElement>, ms = 300) => {
    const [video, setVideo] = React.useState<Optional<HTMLVideoElement>>(null)
    const [detachedVideo, setDetachedVideo] = React.useState<Optional<HTMLVideoElement>>(null)
    const [episodeInfo, setEpisodeInfo] = React.useState<Optional<EpisodeInfo>>(null)
    const staticStore = useStaticStore(Store.WATCHED)
    React.useLayoutEffect(() => {
        if (info.anime) {
            setEpisodeInfo(null)
            staticStore.get(info.anime.name, info.anime.episode).then((videoInfo) => {
                setEpisodeInfo(videoInfo || {})
            })
        }
    }, [info.anime?.name, info.anime?.episode, info.option?.name])

    React.useLayoutEffect(() => {
        if (container && episodeInfo !== null) {
            const interval: { handle?: number; handledSpecificOptions?: boolean } = {}
            const iframeContent = $(container).find('iframe')
            const check = () => {
                const contents = iframeContent.contents()
                if (!interval.handledSpecificOptions) {
                    interval.handledSpecificOptions = handleSpecificOptions(info.option, contents, episodeInfo)
                }
                const video = deepFindVideos(contents)
                console.debug('Trying to find video: ', video)
                const targetVideo = video?.find((vid) => {
                    const jVid = $(vid)
                    if (jVid.attr('src')) {
                        return true
                    } else if (jVid.find('source[src]').length) {
                        return true
                    }
                    return false
                })
                if (targetVideo) {
                    setVideo(targetVideo)
                    const jTargetVideo = $(targetVideo)
                    jTargetVideo.on('DOMNodeRemoved', () => {
                        if (jTargetVideo.parent().length === 0) {
                            console.debug('VIDEO DETACHED')
                            setVideo((p) => {
                                if (p === targetVideo) {
                                    jTargetVideo.off('DOMNodeRemoved', '**')
                                    return null
                                }
                                return p
                            })
                            setDetachedVideo(targetVideo)
                        }
                    })
                    clearInterval(interval.handle)
                }
            }
            interval.handle = setInterval(check, ms)
            check()
            return () => {
                clearInterval(interval.handle)
            }
        }
    }, [info.anime?.name, info.anime?.episode, info.option?.name, container, ms, detachedVideo, episodeInfo === null])

    return video
}

export const useVideoImprovements = (info: BasicVideoInfo, container: Optional<HTMLDivElement>) => {
    const video = useVideo(info, container)
    const dispatch = useAppDispatch()
    const staticStore = useStaticStore(Store.WATCHED)
    React.useLayoutEffect(() => {
        if (video) {
            if (!video.autoplay) {
                video.autoplay = true
            }
            const anime = info.anime
            if (anime) {
                staticStore.get(anime.name, anime.episode).then((data: Optional<EpisodeInfo>) => {
                    // Try auto play the video at latest time stored
                    handleSeek(info, data, video)
                })
            }
            const refs: {
                nextButtonShown?: boolean
                nextBtnRef?: JQuery | null
            } = {}
            const handleTimeUpdate = (e: Event) => {
                console.debug('TARGET', e.target, e.currentTarget)
                if (isFinite(video.duration)) {
                    const { duration, currentTime } = video
                    console.debug('VIDEO TIME', video.currentTime)
                    if (currentTime + SECONDS_LEFT_TO_NEXT_EPISODE >= duration) {
                        const timeoutToNextEpisode = Math.max(
                            0,
                            duration - (currentTime + SECONDS_LEFT_TO_TRIGGER_NEXT_EPISODE),
                        )
                        if (timeoutToNextEpisode === 0) {
                            // With timeout -1 auto play next episode is disabled (user probable moved the mouse)
                            if (store.getState().watch.nextEpisodeTimeout !== -1) {
                                dispatch(watch.nextEpisode())
                                refs.nextButtonShown = false
                                dispatch(watch.setNextEpisodeButton(false))
                            }
                        } else if (!refs.nextButtonShown) {
                            refs.nextButtonShown = true
                            dispatch(watch.setNextEpisodeButton(true))
                            dispatch(watch.setNextEpisodeTimeout(SECONDS_NEXT_BUTTON_DISPLAY))
                        }
                    } else if (refs.nextButtonShown) {
                        refs.nextButtonShown = false
                        dispatch(watch.setNextEpisodeButton(false))
                    }
                    if (
                        anime &&
                        anime.name &&
                        typeof anime.episode === 'number' &&
                        // Save each 3 seconds
                        Math.floor(video.currentTime) % 3 === 0
                    ) {
                        staticStore.set(anime.name, anime.episode, {
                            duration: video.duration,
                            currentTime: video.currentTime,
                            at: new Date().getTime(),
                        } as EpisodeInfo)
                    }
                }
            }
            console.debug('VIDEO', video)
            const handleMouseMove = () => {
                dispatch(watch.setNextEpisodeTimeout(-1))
            }
            const handleFullScreen = () => {
                // document.fullscreenElement will point to the element that
                // is in fullscreen mode if there is one. If there isn't one,
                // the value of the property is null.
                let targetElement: Optional<Element> = document.fullscreenElement
                // The target fullscreen element changes depending on the iframe we're in
                // It's needed to find an non iframe element to attach the button
                // so that its visible in fullscreen mode
                while (targetElement?.tagName.toLowerCase() === 'iframe' && 'contentDocument' in targetElement) {
                    // targetElement instanceof HTMLIFrameElement does not work for iframes
                    // Alternative: Use iframe.contentWindow.HTMLIFrameElement
                    // However, this might be a cleaner way
                    targetElement = (targetElement as HTMLIFrameElement).contentDocument?.fullscreenElement
                }
                if (targetElement) {
                    const jTargetElement = $(targetElement as HTMLElement)
                    console.debug('Setting fullscreen')
                    const root = refs.nextBtnRef || $("<div id='raex-injected-root' />")
                    if (!root.parent().is(jTargetElement)) {
                        refs.nextBtnRef = root
                        console.debug('Attaching node to element')
                        jTargetElement.append(root)
                        ReactDOM.render(
                            <Provider store={store}>
                                <NextEpisodeButton />
                            </Provider>,
                            root.get(0),
                        )
                    } else {
                        console.debug('Element already attached')
                    }
                } else {
                    console.debug('Deleting node')
                    refs.nextBtnRef?.remove()
                    refs.nextBtnRef = null
                }
            }
            document.addEventListener('fullscreenchange', handleFullScreen)
            video.addEventListener('mousemove', handleMouseMove)
            video.addEventListener('timeupdate', handleTimeUpdate)
            return () => {
                video.removeEventListener('timeupdate', handleTimeUpdate)
                video.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('fullscreenchange', handleFullScreen)
            }
        }
    }, [video])
}
