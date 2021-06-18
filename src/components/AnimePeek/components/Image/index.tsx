import React from 'react'
import { FStatus, Optional } from '../../../../types'
import { ipcRenderer } from 'electron'

export type ImageProps = {
    animeName: string
    containerStyle?: React.CSSProperties
} & React.ImgHTMLAttributes<HTMLImageElement>

export const Image: React.FC<ImageProps> = React.memo(
    ({ animeName, containerStyle, ...rest }) => {
        const [realUrl, setRealUrl] = React.useState<Optional<string>>(null)
        const [status, setStatus] = React.useState<FStatus>('idle')
        React.useLayoutEffect(() => {
            setStatus('loading')
            ipcRenderer
                .invoke('getAnimeImage', animeName)
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
                        className={'fade-in'}
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
                        background: ['loading', 'idle'].includes(status)
                            ? 'rgba(200, 200, 200, 0.5)'
                            : 'rgba(200, 200, 200,0)',
                        backdropFilter: ['loading', 'idle'].includes(status)
                            ? 'blur(10px)'
                            : 'none',
                        transition: 'all 200ms',
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
