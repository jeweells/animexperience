import { Icon } from '../../Icon'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import { watch } from '@reducers'
import { useEffect } from 'react'
import { useControls } from '../../hooks'
import { useGoNextEpisode, useGoPreviousEpisode } from '~/src/hooks/shortcuts'

export const NextEpisode = () => {
  const data = useAppSelector((d) => d.watch.info)
  const watching = useAppSelector((d) => d.watch.watching)
  const dispatch = useAppDispatch()

  const { min, max } = data?.episodesRange ?? {}
  const hasMin =
    typeof min === 'number' && typeof watching?.episode === 'number' && watching.episode > min
  const hasMax =
    typeof max === 'number' && typeof watching?.episode === 'number' && watching.episode < max

  const goNext = () => hasMax && dispatch(watch.nextEpisode())
  const goPrev = () => hasMin && dispatch(watch.previousEpisode())

  useGoNextEpisode(goNext)
  useGoPreviousEpisode(goPrev)

  const { video } = useControls()
  useEffect(() => {
    if (!video) return
    const _w = video.ownerDocument.defaultView
    if (!_w) return
    const setHandler = _w.navigator.mediaSession.setActionHandler.bind(_w.navigator.mediaSession)
    setHandler('nexttrack', hasMax ? goNext : null)
    setHandler('previoustrack', hasMin ? goPrev : null)
    return () => {
      setHandler('nexttrack', null)
      setHandler('previoustrack', null)
    }
  }, [video, hasMax, hasMin])

  if (!hasMax) return null
  return (
    <Icon
      name={'skipNext'}
      title={'Siguiente episodio ( Alt + ➜ )'}
      onClick={() => dispatch(watch.nextEpisode())}
    />
  )
}
