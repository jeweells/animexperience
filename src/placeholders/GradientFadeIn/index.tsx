import React from 'react'
import { range } from '../../utils'
import Fade from '@mui/material/Fade'

export type GradientFadeInProps = {
    containerStyle?: React.CSSProperties
    style?: React.CSSProperties
    count: number
    minTimeout?: number
    stepTimeout?: number
    minOpacity?: number
    mode?: 'lr' | 'rl' | 'random'
    render(index: number): React.ReactNode
    renderWrapper?(props: any, children: React.ReactNode): React.ReactNode
}

export const GradientFadeIn: React.FC<GradientFadeInProps> = React.memo(
    ({
        containerStyle,
        count,
        style,
        mode = 'lr',
        minTimeout = 200,
        minOpacity = 0.5,
        stepTimeout = 500,
        render,
        renderWrapper = ((props, children) => (
            <div {...props}>{children}</div>
        )) as Required<GradientFadeInProps>['renderWrapper'],
    }) => {
        const getTimeout = (idx: number) => {
            switch (mode) {
                case 'lr':
                    return minTimeout + idx * stepTimeout
                case 'rl':
                    return minTimeout + (count - idx - 1) * stepTimeout
                case 'random':
                    return minTimeout + count * Math.random() * stepTimeout
            }
        }

        const getOpacity = (idx: number) => {
            const rel = idx / (count - 1)
            switch (mode) {
                case 'lr':
                    return (1 - rel) * (1 - minOpacity) + minOpacity
                case 'rl':
                    return rel * (1 - minOpacity) + minOpacity
                case 'random':
                    return Math.random() * (1 - minOpacity) + minOpacity
            }
        }
        return (
            <React.Fragment>
                {range(count).map((idx) => {
                    return renderWrapper(
                        {
                            key: idx,
                            style: {
                                ...(style || {}),
                                opacity: getOpacity(idx),
                            },
                        },
                        <Fade in={true} appear={true} timeout={getTimeout(idx)}>
                            <div style={containerStyle}>{render(idx)}</div>
                        </Fade>,
                    )
                })}
            </React.Fragment>
        )
    },
)

GradientFadeIn.displayName = 'GradientFadeIn'

export default GradientFadeIn
