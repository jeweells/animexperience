import { usePlayPause } from '../../hooks'
import { Icon } from '../../Icon'

export const PlayButton = () => {
  const { isPlaying, play, pause } = usePlayPause()
  if (isPlaying) return <Icon name={'pause'} title={'Pausar (tecla de espacio)'} onClick={pause} />
  return <Icon name={'play'} title={'Reproducir (tecla de espacio)'} onClick={play} />
}
