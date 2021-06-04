import React from 'react'
import { Icon, IconButton, Modal, ModalProps } from 'rsuite'
import styled from 'styled-components'
import { player } from '../../../redux/reducers/player'
import { useAppDispatch, useAppSelector } from '../../../redux/store'
import VideoPlayerWOptionsPlaceholder from '../../placeholders/VideoPlayerWOptionsPlaceholder'
import EpisodeNavigation from '../EpisodeNavigation'
import VideoPlayerWOptions from '../VideoPlayerWOptions'

const SModal = styled(Modal)`
    margin: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    .rs-modal {
        &-dialog {
            margin: 0;
        }
        &-content {
            padding: 0;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            border-radius: 0;
        }
    }
`

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
        <SModal {...rest} show={show} full={true}>
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
        </SModal>
    )
})

VideoPlayerModal.displayName = 'VideoPlayerModal'

export default VideoPlayerModal
