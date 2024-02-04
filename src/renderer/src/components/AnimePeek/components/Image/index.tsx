import * as React from 'react'
import { useFadeInStyles } from '~/src/globalMakeStyles/fadeIn'
import { IMAGE } from '@selectors'
import { FStatus, Optional } from '@shared/types'
import { rendererInvoke } from '~/src/utils'
import { error } from '@dev/events'

export type ImageProps = {
  animeName: string
  containerStyle?: React.CSSProperties
} & React.ImgHTMLAttributes<HTMLImageElement>

export const Image: React.FC<ImageProps> = React.memo(({ animeName, containerStyle, ...rest }) => {
  const { fadeIn } = useFadeInStyles()
  const [realUrl, setRealUrl] = React.useState<Optional<string>>(null)
  const [status, setStatus] = React.useState<FStatus>('loading')
  React.useEffect(() => {
    setStatus('loading')
    rendererInvoke('getAnimeImage', animeName)
      .then((x) => {
        if (x) {
          setRealUrl(x)
        } else {
          throw new Error('No image')
        }
      })
      .catch((e) => {
        error(e)
        setStatus('failed')
      })
  }, [animeName])
  return (
    <div
      style={{
        position: 'relative',
        ...(containerStyle || {})
      }}
    >
      {/*
                    This image is an immediate url with a low quality image
                    that will be blurred by the <div> below until we fetch the high quality image url
                */}
      <img data-testid={IMAGE.BG_IMAGE} {...rest} />
      {realUrl && (
        <img
          data-testid={IMAGE.IMAGE}
          {...rest}
          onLoad={() => {
            setStatus('succeeded')
          }}
          className={fadeIn}
          src={realUrl}
          style={{
            ...(rest.style || {}),
            position: 'absolute',
            inset: 0
          }}
        />
      )}
      <div
        data-testid={IMAGE.BLUR}
        style={{
          background: 'rgba(200, 200, 200, 0.5)',
          opacity: ['loading', 'idle'].includes(status) ? 1 : 0,
          backdropFilter: 'blur(10px)',
          transition: 'all 1000ms ease-in-out',
          position: 'absolute',
          inset: 0
        }}
      />
    </div>
  )
})

Image.displayName = 'Image'

export default Image
