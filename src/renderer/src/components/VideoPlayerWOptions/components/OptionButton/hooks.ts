import { useCallback, useMemo } from 'react'
import { playerOptions } from '@reducers/playerOptions'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import { Optional } from '@shared/types'

export const usePlayerOption = (name: Optional<string>) => {
  const opts = useAppSelector((d) => d.playerOptions.options)
  const dispatch = useAppDispatch()
  const option = useMemo(() => opts?.find((d) => d.name === name), [opts, name])
  return {
    option,
    prefer: useCallback(
      (value: boolean) => {
        name && dispatch(playerOptions.prefer({ name, value }))
      },
      [name, dispatch]
    ),
    use: useCallback(() => {
      name && dispatch(playerOptions.use(name))
    }, [name, dispatch])
  }
}
