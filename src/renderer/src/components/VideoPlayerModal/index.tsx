import * as React from 'react'
import { player, playerOptions } from '@reducers'

import { useAppDispatch, useAppSelector } from '~/redux/utils'
import CloseButton from '../../atoms/CloseButton'
import VideoPlayerWOptionsPlaceholder from '../../placeholders/VideoPlayerWOptionsPlaceholder'
import { TopView } from '@shared/types'
import EpisodeNavigation from '../EpisodeNavigation'
import FullModal, { FullModalProps } from '../FullModal'
import VideoPlayerWOptions from '../VideoPlayerWOptions'

export type VideoPlayerModalProps = Omit<FullModalProps, 'show' | 'children' | 'view'>

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = React.memo<VideoPlayerModalProps>(
  ({ ...rest }) => {
    const dispatch = useAppDispatch()
    const show = useAppSelector((d) => d.player.open)
    const availableVideosStatus = useAppSelector((d) => d.watch.status.availableVideos)
    const optionsStatus = useAppSelector((d) => d.playerOptions.status.options)
    React.useLayoutEffect(() => {
      dispatch(playerOptions.fetchStore())
    }, [])
    const close = () => {
      dispatch(player.hide())
    }
    return (
      <FullModal {...rest} view={TopView.PLAYER} show={show}>
        {availableVideosStatus === 'succeeded' && optionsStatus === 'succeeded' ? (
          <VideoPlayerWOptions>
            <EpisodeNavigation />
            <CloseButton onClick={close} />
          </VideoPlayerWOptions>
        ) : (
          <VideoPlayerWOptionsPlaceholder>
            <CloseButton onClick={close} />
          </VideoPlayerWOptionsPlaceholder>
        )}
      </FullModal>
    )
  }
)

VideoPlayerModal.displayName = 'VideoPlayerModal'

export default VideoPlayerModal
