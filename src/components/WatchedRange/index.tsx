import moment from 'moment'
import React from 'react'
import styled from 'styled-components'
import { EpisodeInfo } from '../../../globals/types'
import { Optional } from '../../types'

export type WatchedRangeProps = {
    info: Optional<EpisodeInfo>
    showTime?: boolean
    hideBorder?: boolean
}

const Back = styled.div<{ hideBorder?: boolean }>`
    width: 100%;
    background: rgba(154, 154, 154, 0.2);
    border: ${(props) => (props.hideBorder ? 'none' : '1px solid #dcdcdc')};
    border-radius: 4px;
`

const Progress = styled.div<{ progress: number }>`
    width: ${(props) => props.progress}%;
    height: 4px;
    background: #dcdcdc;
    transition: all 400ms;
`
const hhmmss = (seconds: number) => {
    const mmt = moment().startOf('day').seconds(seconds)
    if (seconds < 3600) {
        return mmt.format('mm:ss')
    }
    return mmt.format('HH:mm:ss')
}

export const WatchedRange: React.FC<WatchedRangeProps> = React.memo<WatchedRangeProps>(
    ({ info, showTime, hideBorder }) => {
        return (
            <React.Fragment>
                <Back hideBorder={hideBorder}>
                    <Progress
                        progress={
                            info && info.duration !== 0
                                ? (info.currentTime / info.duration) * 100
                                : 0
                        }
                    />
                </Back>
                {info && showTime && (
                    <div>{`${hhmmss(info.currentTime)} / ${hhmmss(info.duration)}`}</div>
                )}
            </React.Fragment>
        )
    },
)

WatchedRange.displayName = 'WatchedRange'

export default WatchedRange
