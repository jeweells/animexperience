import React from 'react'
import SvgIcon from '@mui/material/SvgIcon'
import styled from 'styled-components'

export type SortIconProps = {
    order: 'asc' | 'desc'
    size: number
    spacing?: number
    stroke?: number
}

const Svg = styled(SvgIcon)`
    * {
        transition: all 300ms ease-in-out;
    }
`

export const SortIcon = React.memo<SortIconProps>(
    ({ order, size, spacing = 5, stroke = 3 }) => {
        return (
            <Svg>
                <line
                    x1={0}
                    x2={size}
                    y2={size / 2 - stroke - spacing}
                    y1={size / 2 - stroke - spacing}
                    strokeWidth={stroke}
                    stroke={'currentColor'}
                    style={{
                        transform: `scaleX(${order === 'asc' ? 0.25 : 1})`,
                    }}
                />
                <line
                    x1={0}
                    x2={size}
                    y2={size / 2}
                    y1={size / 2}
                    strokeWidth={stroke}
                    stroke={'currentColor'}
                    style={{
                        transform: 'scaleX(0.5)',
                    }}
                />
                <line
                    x1={0}
                    x2={size}
                    y2={size / 2 + stroke + spacing}
                    y1={size / 2 + stroke + spacing}
                    strokeWidth={stroke}
                    stroke={'currentColor'}
                    style={{
                        transform: `scaleX(${order === 'desc' ? 0.25 : 1})`,
                    }}
                />
            </Svg>
        )
    },
)

SortIcon.displayName = 'SortIcon'

export default SortIcon
