import * as React from 'react'
import { player } from '@reducers/player'
import { playerOptions } from '@reducers/playerOptions'

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
      <FullModal
        {...rest}
        view={TopView.PLAYER}
        show={show}
        onPopRequested={() => {
          dispatch(player.hide())
        }}
      >
        <VideoPlayerWOptions />
      </FullModal>
    )
  }
)

VideoPlayerModal.displayName = 'VideoPlayerModal'

export default VideoPlayerModal
