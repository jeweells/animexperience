import { Tabs } from '@material-ui/core'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useAppSelector } from '../../../redux/store'
import { OptionsRow } from '../../placeholders/VideoPlayerWOptionsPlaceholder'
import VideoPlayer, { VideoOption } from '../VideoPlayer'
import OptionButton from './components/OptionButton'

const STabs = styled(Tabs)`
    min-height: 0;
    .MuiTabs-flexContainer {
        gap: 16px;
    }
`

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
                    <STabs
                        variant={'scrollable'}
                        TabIndicatorProps={{
                            style: {
                                display: 'none',
                            },
                        }}
                        value={-1}
                    >
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
                    </STabs>
                    {children}
                </OptionsRow>
            </VideoPlayer>
        )
    },
)

VideoPlayerWOptions.displayName = 'VideoPlayerWOptions'

export default VideoPlayerWOptions
