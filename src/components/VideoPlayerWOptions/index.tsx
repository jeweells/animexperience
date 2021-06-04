import React from 'react'
import { Button } from 'rsuite'
import { useAppSelector } from '../../../redux/store'
import { Options, OptionsRow } from '../../placeholders/VideoPlayerWOptionsPlaceholder'
import VideoPlayer, { VideoOption } from '../VideoPlayer'

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
                            <Button
                                disabled={currentOption?.name === x?.name}
                                key={idx}
                                onClick={() => {
                                    setCurrentOption(x)
                                }}
                            >
                                {x.name}
                            </Button>
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
