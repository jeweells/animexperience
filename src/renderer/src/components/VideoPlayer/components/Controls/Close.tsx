import { Icon } from './Icon'
import { player } from '@reducers'
import { useAppDispatch } from '~/redux/utils'

export const Close = () => {
  const dispatch = useAppDispatch()
  return (
    <Icon
      name={'close'}
      title={'Cerrar ( Esc )'}
      onClick={() => {
        dispatch(player.hide())
      }}
    />
  )
}
