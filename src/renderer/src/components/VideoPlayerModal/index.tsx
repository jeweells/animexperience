import * as React from 'react'
import { playerOptions } from '@reducers'

import { useAppDispatch, useAppSelector } from '~/redux/utils'
import { TopView } from '@shared/types'
import FullModal, { FullModalProps } from '../FullModal'
import VideoPlayerWOptions from '../VideoPlayerWOptions'

export type VideoPlayerModalProps = Omit<FullModalProps, 'show' | 'children' | 'view'>

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = React.memo<VideoPlayerModalProps>(
  ({ ...rest }) => {
    const dispatch = useAppDispatch()
    const show = useAppSelector((d) => d.player.open)

    React.useLayoutEffect(() => {
      dispatch(playerOptions.fetchStore())
    }, [])
    return (
      <FullModal {...rest} view={TopView.PLAYER} show={show}>
        <VideoPlayerWOptions />
      </FullModal>
    )
  }
)

VideoPlayerModal.displayName = 'VideoPlayerModal'

export default VideoPlayerModal
