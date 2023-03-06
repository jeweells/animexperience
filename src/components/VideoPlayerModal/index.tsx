import React from 'react'
import { player } from '../../../redux/reducers/player'
import { playerOptions } from '../../../redux/reducers/playerOptions'
import { useAppSelector, useAppDispatch } from '../../../redux/utils'
import CloseButton from '../../atoms/CloseButton'
import VideoPlayerWOptionsPlaceholder from '../../placeholders/VideoPlayerWOptionsPlaceholder'
import { TopView } from '../../types'
import EpisodeNavigation from '../EpisodeNavigation'
import FullModal, { FullModalProps } from '../FullModal'
import VideoPlayerWOptions from '../VideoPlayerWOptions'

export type VideoPlayerModalProps = Omit<FullModalProps, 'show' | 'children' | 'view'>

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> =
    React.memo<VideoPlayerModalProps>(({ ...rest }) => {
        const dispatch = useAppDispatch()
        const show = useAppSelector((d) => d.player.open)
        const availableVideosStatus = useAppSelector(
            (d) => d.watch.status.availableVideos,
        )
        const optionsStatus = useAppSelector((d) => d.playerOptions.status.options)
        React.useLayoutEffect(() => {
            dispatch(playerOptions.fetchStore())
        }, [])
        const close = () => {
            dispatch(player.hide())
        }
        return (
            <FullModal {...rest} view={TopView.PLAYER} show={show}>
                {availableVideosStatus === 'succeeded' &&
                optionsStatus === 'succeeded' ? (
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
    })

VideoPlayerModal.displayName = 'VideoPlayerModal'

export default VideoPlayerModal
