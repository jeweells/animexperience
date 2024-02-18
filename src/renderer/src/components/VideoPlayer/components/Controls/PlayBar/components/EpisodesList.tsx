import { Icon } from '../../Icon'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import { peek } from '@reducers'
import { useOpenEpisodeList } from '~/src/hooks/shortcuts'

export const EpisodesList = () => {
  const watching = useAppSelector((d) => d.watch.watching)
  const dispatch = useAppDispatch()
  const tryPeeking = () => {
    if (!watching?.name) return
    dispatch(peek.peek(watching.name))
  }

  useOpenEpisodeList(tryPeeking)

  return (
    <Icon
      style={{ fontSize: '1.5rem' }}
      name={'listNumbered'}
      title={'Episodios ( e )'}
      onClick={tryPeeking}
    />
  )
}
