import { useFullscreen } from '../../hooks'
import { Icon } from '../../Icon'

export const FullscreenButton = () => {
  const { isFullscreen, toggleFullscreen } = useFullscreen()
  if (isFullscreen)
    return (
      <Icon
        name={'exitFullscreen'}
        title={'Salir de pantalla completa (f)'}
        onClick={toggleFullscreen}
      />
    )
  return <Icon name={'fullscreen'} title={'Pantalla completa (f)'} onClick={toggleFullscreen} />
}
