import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Context } from './context'
import { useIsFullscreen } from '~/src/hooks/useIsFullscreen'
import { range } from '~/src/utils'

export const useControls = () => useContext(Context)

const MS_TO_HIDE = 4000

export const useShowControls = () => {
  const [show, setShow] = useState(true)
  const { isPlaying } = usePlayPause()
  const { loading } = useLoading()
  const { video } = useControls()

  useLayoutEffect(() => {
    if (!isPlaying) setShow(true)
    if (loading) setShow(true)
  }, [isPlaying, loading])

  useEffect(() => {
    if (!video) return
    const showPlayBar = () => {
      setShow(true)
    }
    document.addEventListener('mousemove', showPlayBar)
    video.addEventListener('mousemove', showPlayBar)
    return () => {
      video.removeEventListener('mousemove', showPlayBar)
      document.removeEventListener('mousemove', showPlayBar)
    }
  }, [video])

  useEffect(() => {
    if (!isPlaying) return
    if (loading) return
    if (!show) return
    const t = setTimeout(() => {
      setShow(false)
    }, MS_TO_HIDE)
    return () => clearTimeout(t)
  }, [show, isPlaying, loading])
  return { show, transitionMs: 500 }
}

export const usePlayPause = () => {
  const { video } = useControls()
  const [playing, setPlaying] = useState(false)

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
    play: () => video?.play() ?? Promise.resolve(),
    pause: () => video?.pause()
  }
}

export const useVolume = () => {
  const { video } = useControls()
  const [volume, setVolume] = useState(0)
  useLayoutEffect(() => {
    if (video) return
    setVolume(0)
  }, [video])

  useEffect(() => {
    if (!video) return
    const updateVolume = () => {
      setVolume(video.volume)
    }
    updateVolume()
    video.addEventListener('volumechange', updateVolume)
    return () => {
      video.removeEventListener('volumechange', updateVolume)
    }
  }, [video])
  return {
    volume,
    setVolume: (value: number) => {
      if (!video) return
      video.volume = value
      setVolume(value)
    }
  }
}

const defaultTime = { currentTime: 0, duration: 0 }

export const useSeek = () => {
  const { video } = useControls()
  const [time, setTime] = useState(defaultTime)

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
    seek: (value: number) => {
      if (!video) return
      video.currentTime = value
    },
    fastSeek: (value: number) => {
      if (!video) return
      if (!video.fastSeek) video.currentTime = value
      else video.fastSeek(value)
    }
  }
}

export const useBuffer = () => {
  const { video } = useControls()

  type Buffer = {
    start: number
    end: number
  }

  const [buffered, setBuffered] = useState<Buffer[]>([])

  useLayoutEffect(() => {
    if (video) return
    if (buffered.length) setBuffered([])
  }, [video])

  useEffect(() => {
    if (!video) return
    const updateBuffer = () => {
      setBuffered(
        range(video.buffered.length).map((index) => {
          return {
            start: video.buffered.start(index) / video.duration,
            end: video.buffered.end(index) / video.duration
          }
        })
      )
    }
    updateBuffer()
    video.addEventListener('progress', updateBuffer)
    return () => {
      video.removeEventListener('progress', updateBuffer)
    }
  }, [video])
  return {
    buffered
  }
}

export const useLoading = () => {
  const { video } = useControls()

  const [loading, setLoading] = useState(true)

  useLayoutEffect(() => {
    if (video) return
    setLoading(true)
  }, [video])

  useEffect(() => {
    if (!video) return
    const seeking = () => {
      setLoading(video.seeking)
    }
    const seeked = () => {
      setLoading(video.seeking)
    }
    seeking()
    video.addEventListener('seeking', seeking)
    video.addEventListener('seeked', seeked)
    return () => {
      video.removeEventListener('seeking', seeking)
      video.removeEventListener('seeked', seeked)
    }
  }, [video])
  return {
    loading
  }
}

export const useFullscreen = () => {
  const isFullscreen = useIsFullscreen()

  return {
    isFullscreen,
    toggleFullscreen: () => {
      return window.setFullscreen(!isFullscreen)
    }
  }
}
