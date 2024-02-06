import { useSeek } from '../../hooks'
import { Text } from './Text'
import { formatTime } from '~/src/utils'

export const Duration = () => {
  const { time } = useSeek()
  if (!isFinite(time.duration)) return null
  if (!isFinite(time.currentTime)) return null
  if (!time.duration) return null

  return (
    <Text
      style={{ textShadow: 'none' }}
    >{`${formatTime(time.currentTime)} / ${formatTime(time.duration)}`}</Text>
  )
}
