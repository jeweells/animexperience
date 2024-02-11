import { useEffect, useLayoutEffect, useState } from 'react'
import { useLoading } from './useLoading'
import { usePlayPause } from './usePlayPause'
import { useControls } from './useControls'

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
