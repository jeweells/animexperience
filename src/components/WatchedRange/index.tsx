import React from 'react'
import styled from 'styled-components'
import { EpisodeInfo } from '../../../globals/types'
import { Optional } from '../../types'

export type WatchedRangeProps = {
    info: Optional<EpisodeInfo>
}

const Back = styled.div`
    width: 100%;
    background: rgba(154, 154, 154, 0.2);
    border: 1px solid #dcdcdc;
    border-radius: 4px;
`

const Progress = styled.div<{ progress: number }>`
    width: ${(props) => props.progress}%;
    height: 4px;
    background: #dcdcdc;
    transition: all 400ms;
`

export const WatchedRange: React.FC<WatchedRangeProps> = React.memo<WatchedRangeProps>(
    ({ info }) => {
        return (
            <Back>
                <Progress
                    progress={
                        info && info.duration !== 0
                            ? (info.currentTime / info.duration) * 100
                            : 0
                    }
                />
            </Back>
        )
    },
)

WatchedRange.displayName = 'WatchedRange'

export default WatchedRange
