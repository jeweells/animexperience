import $ from 'jquery'
import useResizeObserver from 'use-resize-observer'
import { useAppSelector } from '~/redux/utils'
import { FCol } from '../../atoms/Layout'
import { useFadeInStyles } from '../../globalMakeStyles/fadeIn'
import { Wrapper } from '../../placeholders/VideoPlayerWOptionsPlaceholder'
import { useVideoImprovements } from './hooks'
import { FC, memo, PropsWithChildren, useCallback, useLayoutEffect, useState } from 'react'
import { Controls } from './components'

export type VideoOption = {
  name: string
  html: string
}
export type VideoPlayerProps = {
  option: VideoOption | null
  onOptionNotFound: () => void
}

const IFrame: FC<
  PropsWithChildren<{
    html?: string
    updateRef?(r: HTMLDivElement | null): void
  }>
> = memo(({ html, updateRef, children }) => {
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

export const VideoPlayer: FC<PropsWithChildren<VideoPlayerProps>> = memo(
  ({ option, onOptionNotFound }) => {
    const [ref, setRef] = useState<HTMLDivElement | null>(null)
    const freezed = useAppSelector((d) => d.player.freezed)
    const watching = useAppSelector((d) => d.watch.watching)
    const { ref: containerRef, width = 1, height = 1 } = useResizeObserver<HTMLDivElement>()

    useLayoutEffect(() => {
      if (!ref) return
      const iframe = $(ref).find('iframe')
      if (!iframe.length) return
      iframe.attr('width', Math.floor(width) - 1)
      iframe.attr('height', Math.floor(height) - 1)
    }, [ref, option?.name, width, height])

    const { video } = useVideoImprovements({
      info: {
        anime: watching,
        option
      },
      container: ref,
      onOptionNotFound
    })

    const updateWrapperRef = useCallback((r: HTMLDivElement | null) => {
      setRef(r)
      return containerRef(r)
    }, [])

    return (
      <Wrapper
        style={{
          width: '100vw',
          height: 'var(--modal-height)'
        }}
      >
        {!freezed && option && <IFrame html={option?.html} updateRef={updateWrapperRef}></IFrame>}
        <Controls video={video ?? null} />
      </Wrapper>
    )
  }
)

VideoPlayer.displayName = 'VideoPlayer'

export default VideoPlayer
