import { usePlayPause } from '../../hooks'
import { Icon } from '../../Icon'

export const PlayButton = () => {
  const { isPlaying, play, pause } = usePlayPause()
  if (isPlaying) return <Icon name={'pause'} title={'Pausar ( Tecla espacio )'} onClick={pause} />
  return <Icon name={'play'} title={'Reproducir ( Tecla espacio )'} onClick={play} />
}
