import moment from 'moment'
import React from 'react'
import styled from 'styled-components'
import { EpisodeInfo } from '../../../globals/types'
import { Optional } from '../../types'
import Tooltip from '@mui/material/Tooltip'

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
        const fmtDuration = React.useMemo(
            () => (info ? `${hhmmss(info.currentTime)} / ${hhmmss(info.duration)}` : ''),
            [info?.currentTime, info?.duration],
        )
        return (
            <React.Fragment>
                <Tooltip
                    open={showTime ? false : undefined}
                    enterDelay={1000}
                    enterNextDelay={1000}
                    enterTouchDelay={1000}
                    followCursor
                    title={fmtDuration}
                >
                    <Back hideBorder={hideBorder}>
                        <Progress
                            progress={
                                info && info.duration !== 0
                                    ? (info.currentTime / info.duration) * 100
                                    : 0
                            }
                        />
                    </Back>
                </Tooltip>
                {info && showTime && <div>{fmtDuration}</div>}
            </React.Fragment>
        )
    },
)

WatchedRange.displayName = 'WatchedRange'

export default WatchedRange
