import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useControls } from './useControls'

export const usePlayPause = () => {
  const { video } = useControls()
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!video) return
    const _w = video.ownerDocument.defaultView
    if (!_w) return
    _w.navigator.mediaSession.playbackState = playing ? 'playing' : 'paused'
  }, [video, playing])

  const play = useCallback(() => video?.play() ?? Promise.resolve(), [video])
  const pause = useCallback(() => video?.pause(), [video])

  useEffect(() => {
    if (!video) return
    const _w = video.ownerDocument.defaultView
    if (!_w) return
    const setHandler = _w.navigator.mediaSession.setActionHandler.bind(_w.navigator.mediaSession)
    setHandler('pause', () => {
      pause()
    })
    setHandler('play', () => {
      void play()
    })
    setHandler('stop', () => {
      pause()
    })
    return () => {
      setHandler('pause', null)
      setHandler('play', null)
      setHandler('stop', null)
    }
  }, [video])

  useLayoutEffect(() => {
    if (video) return
    setPlaying(false)
  }, [video])

  useEffect(() => {
    if (!video) return
    const handlePlay = () => {
      setPlaying(true)
    }
    const handlePause = () => {
      setPlaying(false)
    }
    setPlaying(!video.paused)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [video])

  return {
    isPlaying: playing,
    play,
    pause
  }
}
