import { Icon } from './Icon'
import { player } from '@reducers'
import { useAppDispatch } from '~/redux/utils'

export const Close = () => {
  const dispatch = useAppDispatch()
  return (
    <Icon
      name={'close'}
      title={'Cerrar (escape)'}
      onClick={() => {
        dispatch(player.hide())
      }}
    />
  )
}
