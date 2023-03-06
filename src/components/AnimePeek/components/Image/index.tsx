import React from 'react'
import { useFadeInStyles } from '~/src/globalMakeStyles/fadeIn'
import { FStatus, Optional } from '~/src/types'
import { rendererInvoke } from '~/src/utils'

export type ImageProps = {
    animeName: string
    containerStyle?: React.CSSProperties
} & React.ImgHTMLAttributes<HTMLImageElement>

export const Image: React.FC<ImageProps> = React.memo(
    ({ animeName, containerStyle, ...rest }) => {
        const { fadeIn } = useFadeInStyles()
        const [realUrl, setRealUrl] = React.useState<Optional<string>>(null)
        const [status, setStatus] = React.useState<FStatus>('idle')
        React.useLayoutEffect(() => {
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
                    console.error(e)
                    setStatus('failed')
                })
        }, [animeName])
        return (
            <div
                style={{
                    position: 'relative',
                    ...(containerStyle || {}),
                }}
            >
                <img {...rest} />
                {realUrl && (
                    <img
                        {...rest}
                        onLoad={() => {
                            setStatus('succeeded')
                        }}
                        className={fadeIn}
                        src={realUrl}
                        style={{
                            ...(rest.style || {}),
                            position: 'absolute',
                            inset: 0,
                        }}
                    />
                )}
                <div
                    style={{
                        background: 'rgba(200, 200, 200, 0.5)',
                        opacity: ['loading', 'idle'].includes(status) ? 1 : 0,
                        backdropFilter: 'blur(10px)',
                        transition: 'all 1000ms ease-in-out',
                        position: 'absolute',
                        inset: 0,
                    }}
                />
            </div>
        )
    },
)

Image.displayName = 'Image'

export default Image
