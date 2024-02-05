import { Icon } from '../../Icon'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import { peek } from '@reducers'
import { useEffect } from 'react'

export const EpisodesList = () => {
  const watching = useAppSelector((d) => d.watch.watching)
  const dispatch = useAppDispatch()
  const tryPeeking = () => {
    if (!watching?.name) return
    dispatch(peek.peek(watching.name))
  }

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'e') tryPeeking()
    }
    document.addEventListener('keyup', handle)
    return () => {
      document.removeEventListener('keyup', handle)
    }
  }, [])

  return (
    <Icon
      style={{ fontSize: '1.5rem' }}
      name={'listNumbered'}
      title={'Episodios (e)'}
      onClick={tryPeeking}
    />
  )
}
