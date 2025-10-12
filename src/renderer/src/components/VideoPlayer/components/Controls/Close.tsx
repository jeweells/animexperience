import { Icon } from './Icon'
import { player } from '@reducers/player'
import { useFullscreen } from '@renderer/hooks/useFullscreen'
import { useAppDispatch } from '~/redux/utils'

export const Close = () => {
  const dispatch = useAppDispatch()
  const { exitFullscreen } = useFullscreen()
  return (
    <Icon
      name={'close'}
      title={'Cerrar ( Esc )'}
      onClick={() => {
        exitFullscreen()
        dispatch(player.hide())
      }}
    />
  )
}
