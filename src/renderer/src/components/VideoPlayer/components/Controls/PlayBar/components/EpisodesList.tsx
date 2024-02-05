import { Icon } from '../../Icon'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import { peek } from '@reducers'
import { useKeyUp } from '~/src/hooks/useKeyboardKeys'

export const EpisodesList = () => {
  const watching = useAppSelector((d) => d.watch.watching)
  const dispatch = useAppDispatch()
  const tryPeeking = () => {
    if (!watching?.name) return
    dispatch(peek.peek(watching.name))
  }

  useKeyUp(tryPeeking, { key: 'e' })

  return (
    <Icon
      style={{ fontSize: '1.5rem' }}
      name={'listNumbered'}
      title={'Episodios ( e )'}
      onClick={tryPeeking}
    />
  )
}
