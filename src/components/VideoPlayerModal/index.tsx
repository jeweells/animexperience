import React from 'react'
import { Icon, IconButton, ModalProps } from 'rsuite'
import { player } from '../../../redux/reducers/player'
import { useAppDispatch, useAppSelector } from '../../../redux/store'
import VideoPlayerWOptionsPlaceholder from '../../placeholders/VideoPlayerWOptionsPlaceholder'
import { TopView } from '../../types'
import EpisodeNavigation from '../EpisodeNavigation'
import FullModal from '../FullModal'
import VideoPlayerWOptions from '../VideoPlayerWOptions'

export type VideoPlayerModalProps = Omit<ModalProps, 'show'>

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = React.memo<
    VideoPlayerModalProps
>(({ ...rest }) => {
    const show = useAppSelector((d) => d.player.open)
    const availableVideosStatus = useAppSelector((d) => d.watch.status.availableVideos)
    const dispatch = useAppDispatch()
    const close = () => {
        dispatch(player.hide())
    }
    return (
        <FullModal {...rest} view={TopView.PLAYER} show={show}>
            {availableVideosStatus === 'succeeded' ? (
                <VideoPlayerWOptions>
                    <EpisodeNavigation />
                    <IconButton
                        onClick={close}
                        icon={<Icon icon={'close'} size={'lg'} />}
                        size={'lg'}
                    />
                </VideoPlayerWOptions>
            ) : (
                <VideoPlayerWOptionsPlaceholder>
                    <IconButton
                        onClick={close}
                        icon={<Icon icon={'close'} size={'lg'} />}
                        size={'lg'}
                    />
                </VideoPlayerWOptionsPlaceholder>
            )}
        </FullModal>
    )
})

VideoPlayerModal.displayName = 'VideoPlayerModal'

export default VideoPlayerModal
