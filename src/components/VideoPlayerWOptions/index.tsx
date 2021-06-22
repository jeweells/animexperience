import React from 'react'
import { useAppSelector } from '../../../redux/store'
import { Options, OptionsRow } from '../../placeholders/VideoPlayerWOptionsPlaceholder'
import VideoPlayer, { VideoOption } from '../VideoPlayer'
import OptionButton from './components/OptionButton'

export type VideoPlayerWOptionsProps = {}

export const VideoPlayerWOptions: React.FC<VideoPlayerWOptionsProps> = React.memo(
    ({ children }) => {
        const options = useAppSelector((d) => d.watch.availableVideos)
        const [currentOption, setCurrentOption] = React.useState<VideoOption | null>(null)
        React.useLayoutEffect(() => {
            if (!currentOption && options?.[0]) {
                setCurrentOption(options[0])
            }
        }, [options])
        console.debug('Current option', currentOption)
        return (
            <VideoPlayer option={currentOption}>
                <OptionsRow className={'fade-in'}>
                    <Options>
                        {options?.map((x, idx) => (
                            <OptionButton
                                disabled={currentOption?.name === x?.name}
                                key={idx}
                                option={x}
                                onClick={() => {
                                    setCurrentOption(x)
                                }}
                            />
                        ))}
                    </Options>
                    {children}
                </OptionsRow>
            </VideoPlayer>
        )
    },
)

VideoPlayerWOptions.displayName = 'VideoPlayerWOptions'

export default VideoPlayerWOptions
