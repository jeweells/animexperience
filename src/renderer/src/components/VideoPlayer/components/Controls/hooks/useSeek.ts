import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { FAST_SEEK_BACKWARD_IN_SECONDS, FAST_SEEK_FORWARD_IN_SECONDS } from '~/src/constants'
import { useControls } from './useControls'

const defaultTime = { currentTime: 0, duration: 0 }

export const useSeek = () => {
  const { video } = useControls()
  const [time, setTime] = useState(defaultTime)

  const seek = useCallback(
    (value: number) => {
      if (!video) return
      video.currentTime = value
    },
    [video]
  )

  const fastSeek = useCallback(
    (value: number) => {
      if (!video) return
      if (!video.fastSeek) video.currentTime = value
      else video.fastSeek(value)
    },
    [video]
  )

  const seekForward = useCallback(() => {
    const nextCurrentTime = time.currentTime + FAST_SEEK_FORWARD_IN_SECONDS
    if (nextCurrentTime > time.duration) return
    fastSeek(nextCurrentTime)
  }, [fastSeek, time])
  const seekBackward = useCallback(() => {
    fastSeek(Math.max(0, time.currentTime - FAST_SEEK_BACKWARD_IN_SECONDS))
  }, [fastSeek, time])

  useEffect(() => {
    if (!video) return
    const _w = video.ownerDocument.defaultView
    if (!_w) return
    const setHandler = _w.navigator.mediaSession.setActionHandler.bind(_w.navigator.mediaSession)
    setHandler('seekto', (details) => {
      if (!details.seekTime) return
      seek(details.seekTime)
    })
    setHandler('seekforward', () => {
      seekForward()
    })
    setHandler('seekbackward', () => {
      seekBackward()
    })

    return () => {
      setHandler('seekto', null)
      setHandler('seekforward', null)
      setHandler('seekbackward', null)
    }
  }, [video])

  useLayoutEffect(() => {
    if (video) return
    setTime(defaultTime)
  }, [video])

  useEffect(() => {
    if (!video) return
    const updateTime = () => {
      setTime({
        currentTime: video.currentTime,
        duration: video.duration
      })
    }
    updateTime()
    video.addEventListener('timeupdate', updateTime)
    return () => {
      video.removeEventListener('timeupdate', updateTime)
    }
  }, [video])
  return {
    time: video ? time : { currentTime: 0, duration: 0 },
    seek,
    fastSeek,
    seekForward,
    seekBackward
  }
}
