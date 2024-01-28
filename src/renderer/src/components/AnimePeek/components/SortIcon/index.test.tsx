import SortIcon, { SortIconProps } from './index'
import theme from '../../../../theme'
import { ThemeProvider } from '@mui/material'

const orders: Array<SortIconProps['order']> = ['asc', 'desc']

describe('SortIcon', () => {
  let props: SortIconProps

  const getComponent = (override: Partial<SortIconProps> = {}) => {
    return (
      <ThemeProvider theme={theme}>
        <SortIcon {...props} {...override} />
      </ThemeProvider>
    )
  }

  beforeEach(() => {
    props = {
      order: 'asc',
      size: 30
    }
  })

  it.each(orders.map((order) => [order]))('renders default with order=%s', async (order) => {
    const wrapper = render(getComponent({ order: order as SortIconProps['order'] }))
    expect(wrapper.asFragment()).toMatchSnapshot()
  })
})
