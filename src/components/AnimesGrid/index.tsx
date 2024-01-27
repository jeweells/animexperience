import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { range } from '~/src/utils'

export type AnimeGridProps = {
    count: number
    render: (info: { index: number }) => ReactNode
}

const Wrapper = styled.div`
    display: flex;
    row-gap: 24px;
    column-gap: 4px;
    flex-wrap: wrap;
    overflow: hidden;
`

export const AnimesGrid: React.FC<AnimeGridProps> = React.memo(
    ({ count, children, render }) => {
        return (
            <Wrapper>
                {range(count).map((index) => {
                    return <div key={index}>{render({ index })}</div>
                })}
                {children}
            </Wrapper>
        )
    },
)

AnimesGrid.displayName = 'AnimesGrid'

export default AnimesGrid
