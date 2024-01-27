import { ReactNode, PropsWithChildren, memo, FC } from 'react'
import { styled } from '@mui/system'
import { range } from '~/src/utils'
import { useSizes } from '../AnimesCarousel/hooks'

export type AnimeGridProps = {
  count: number
  render: (info: { index: number }) => ReactNode
}

const Wrapper = styled('div')`
  display: flex;
  row-gap: 24px;
  column-gap: 4px;
  flex-wrap: wrap;
  overflow: hidden;
`

export const AnimesGrid: FC<PropsWithChildren<AnimeGridProps>> = memo(
  ({ count, children, render }) => {
    const { gap } = useSizes()
    return (
      <Wrapper style={{ columnGap: gap }}>
        {range(count).map((index) => {
          return <div key={index}>{render({ index })}</div>
        })}
        {children}
      </Wrapper>
    )
  }
)

AnimesGrid.displayName = 'AnimesGrid'

export default AnimesGrid
