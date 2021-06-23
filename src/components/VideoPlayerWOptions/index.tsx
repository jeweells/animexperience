import React, { useMemo, useState } from 'react'
import { useAppSelector } from '../../../redux/store'
import { Options, OptionsRow } from '../../placeholders/VideoPlayerWOptionsPlaceholder'
import VideoPlayer, { VideoOption } from '../VideoPlayer'
import OptionButton from './components/OptionButton'

export type VideoPlayerWOptionsProps = {}

export const VideoPlayerWOptions: React.FC<VideoPlayerWOptionsProps> = React.memo(
    ({ children }) => {
        const availableOptions = useAppSelector((d) => d.watch.availableVideos)
        const usedOptions = useAppSelector((d) => d.playerOptions.options)
        const [currentOption, setCurrentOption] = useState<VideoOption | null>(null)
        const sortedOptions = useMemo(() => {
            if (Array.isArray(usedOptions) && Array.isArray(availableOptions)) {
                return availableOptions
                    .map((a) => {
                        return {
                            ...a,
                            score: usedOptions.find((u) => u.name === a.name)?.score ?? 0,
                        }
                    })
                    .sort((a, b) => {
                        return b.score - a.score
                    })
            }
            return []
        }, [availableOptions, usedOptions])

        React.useLayoutEffect(() => {
            if (sortedOptions.length > 0 && !currentOption) {
                setCurrentOption(sortedOptions[0])
            }
        }, [sortedOptions, currentOption])
        return (
            <VideoPlayer option={currentOption}>
                <OptionsRow className={'fade-in'}>
                    <Options>
                        {sortedOptions?.map((x, idx) => (
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
