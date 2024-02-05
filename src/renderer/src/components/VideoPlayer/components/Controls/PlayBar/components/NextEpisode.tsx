import { Icon } from '../../Icon'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import { watch } from '@reducers'
import { useEffect } from 'react'

export const NextEpisode = () => {
  const data = useAppSelector((d) => d.watch.info)
  const watching = useAppSelector((d) => d.watch.watching)
  const dispatch = useAppDispatch()

  const { min, max } = data?.episodesRange ?? {}
  const hasMin =
    typeof min === 'number' && typeof watching?.episode === 'number' && watching.episode > min
  const hasMax =
    typeof max === 'number' && typeof watching?.episode === 'number' && watching.episode < max

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && hasMax) dispatch(watch.nextEpisode())
      if (e.key === 'ArrowLeft' && hasMin) dispatch(watch.previousEpisode())
    }
    document.addEventListener('keyup', handle)
    return () => {
      document.removeEventListener('keyup', handle)
    }
  }, [])

  if (!hasMax) return null
  return (
    <Icon
      name={'skipNext'}
      title={'Siguiente episodio (flecha derecha)'}
      onClick={() => dispatch(watch.nextEpisode())}
    />
  )
}
