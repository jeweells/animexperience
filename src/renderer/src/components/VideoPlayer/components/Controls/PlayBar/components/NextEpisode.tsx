import { Icon } from '../../Icon'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import { watch } from '@reducers'
import { useKeyUp } from '~/src/hooks/useKeyboardKeys'

export const NextEpisode = () => {
  const data = useAppSelector((d) => d.watch.info)
  const watching = useAppSelector((d) => d.watch.watching)
  const dispatch = useAppDispatch()

  const { min, max } = data?.episodesRange ?? {}
  const hasMin =
    typeof min === 'number' && typeof watching?.episode === 'number' && watching.episode > min
  const hasMax =
    typeof max === 'number' && typeof watching?.episode === 'number' && watching.episode < max

  useKeyUp(() => hasMax && dispatch(watch.nextEpisode()), { key: 'ArrowRight', altKey: true })
  useKeyUp(() => hasMin && dispatch(watch.previousEpisode()), { key: 'ArrowLeft', altKey: true })

  if (!hasMax) return null
  return (
    <Icon
      name={'skipNext'}
      title={'Siguiente episodio ( Alt + ➜ )'}
      onClick={() => dispatch(watch.nextEpisode())}
    />
  )
}
