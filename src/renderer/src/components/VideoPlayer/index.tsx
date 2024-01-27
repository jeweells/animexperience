import $ from 'jquery'
import * as React from 'react'
import useResizeObserver from 'use-resize-observer'
import { useAppSelector } from '~/redux/utils'
import { FCol } from '../../atoms/Layout'
import { useFadeInStyles } from '../../globalMakeStyles/fadeIn'
import { Wrapper } from '../../placeholders/VideoPlayerWOptionsPlaceholder'
import NextEpisodeButton from '../NextEpisodeButton'
import { useVideoImprovements } from './hooks'

export type VideoOption = {
  name: string
  html: string
}
export type VideoPlayerProps = {
  option: VideoOption | null
}

const IFrame: React.FC<
  React.PropsWithChildren<{
    html?: string
    updateRef?(r: HTMLDivElement | null): void
  }>
> = React.memo(({ html, updateRef, children }) => {
  const { fadeIn } = useFadeInStyles()
  if (!html) return null
  return (
    <FCol
      className={fadeIn}
      style={{ flex: 1, width: '100%', overflow: 'hidden', position: 'relative' }}
      ref={updateRef}
    >
      <div
        style={{ flex: 1, width: '100%', overflow: 'hidden' }}
        ref={updateRef}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {children}
    </FCol>
  )
})

IFrame.displayName = 'IFrame'

export const VideoPlayer: React.FC<React.PropsWithChildren<VideoPlayerProps>> = React.memo(
  ({ option, children }) => {
    const [ref, setRef] = React.useState<HTMLDivElement | null>(null)
    const freezed = useAppSelector((d) => d.player.freezed)
    const watching = useAppSelector((d) => d.watch.watching)
    const { ref: containerRef, width = 1, height = 1 } = useResizeObserver<HTMLDivElement>()
    React.useLayoutEffect(() => {
      if (!ref) return
      const iframe = $(ref).find('iframe')
      if (!iframe) return
      iframe.attr('width', Math.floor(width) - 1)
      iframe.attr('height', Math.floor(height) - 1)
    }, [ref, option?.name, width, height])
    useVideoImprovements(
      {
        anime: watching,
        option
      },
      ref
    )

    const updateWrapperRef = React.useCallback((r: HTMLDivElement | null) => {
      setRef(r)
      return containerRef(r)
    }, [])

    console.debug('FREEZED:', freezed)
    return (
      <Wrapper
        style={{
          width: '100vw',
          height: 'var(--modal-height)'
        }}
      >
        {children}
        {!freezed && option && (
          <IFrame html={option?.html} updateRef={updateWrapperRef}>
            <NextEpisodeButton />
          </IFrame>
        )}
      </Wrapper>
    )
  }
)

VideoPlayer.displayName = 'VideoPlayer'

export default VideoPlayer
