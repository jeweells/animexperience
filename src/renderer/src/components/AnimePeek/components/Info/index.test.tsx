import Info, { InfoProps } from './index'
import theme from '../../../../theme'
import { ThemeProvider } from '@mui/material'

describe('Info', () => {
  let props: InfoProps

  const getComponent = (override: Partial<InfoProps> = {}) => {
    return (
      <ThemeProvider theme={theme}>
        <Info {...props} {...override} />
      </ThemeProvider>
    )
  }

  beforeEach(() => {
    props = {
      title: 'Sample title',
      icon: <div>Sample icon inside div</div>,
      children: <div>Sample children inside div</div>
    }
  })

  it('renders default', async () => {
    const wrapper = render(getComponent())
    expect(wrapper.asFragment()).toMatchSnapshot()
  })
})
