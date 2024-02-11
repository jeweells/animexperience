import { useEffect, useLayoutEffect, useState } from 'react'
import { range } from '~/src/utils'
import { useControls } from './useControls'

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
