import $ from 'jquery'
import useResizeObserver from 'use-resize-observer'
import { useAppSelector } from '~/redux/utils'
import { Wrapper } from '../../placeholders/VideoPlayerWOptionsPlaceholder'
import { useVideoImprovements } from './hooks'
import { FC, memo, PropsWithChildren, useCallback, useLayoutEffect, useState } from 'react'
import { Controls } from './components'
import { Iframe } from './Iframe'

export type VideoOption = {
  name: string
  html: string
}
export type VideoPlayerProps = {
  option: VideoOption | null
  onOptionNotFound: () => void
}

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
        {!freezed && option && (
          <Iframe html={option?.html} updateRef={updateWrapperRef} loading={!video}></Iframe>
        )}
        <Controls video={video ?? null} />
      </Wrapper>
    )
  }
)

VideoPlayer.displayName = 'VideoPlayer'

export default VideoPlayer
