import NavigationButton, { NavigationButtonProps } from './index'
import { NAVIGATION_BUTTON } from '@selectors'
import theme from '../../../../theme'
import { ThemeProvider } from '@mui/material'

describe.each([['right'], ['left']])('NavigationButton (%s)', (direction) => {
  let props: NavigationButtonProps
  const onClick = jest.fn()

  const getComponent = (override: Partial<NavigationButtonProps> = {}) => {
    return (
      <ThemeProvider theme={theme}>
        <NavigationButton {...props} {...override} />
      </ThemeProvider>
    )
  }

  beforeEach(() => {
    props = {
      direction: direction as NavigationButtonProps['direction'],
      onClick
    }
    onClick.mockReset()
  })

  it('renders default', () => {
    const wrapper = render(getComponent())
    fireEvent.click(wrapper.getByTestId(NAVIGATION_BUTTON.BUTTON))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(wrapper.baseElement).toMatchSnapshot()
  })

  it('renders default when disabled', () => {
    const wrapper = render(getComponent({ disabled: true }))
    fireEvent.click(wrapper.getByTestId(NAVIGATION_BUTTON.BUTTON))
    expect(onClick).toHaveBeenCalledTimes(0)
    expect(wrapper.baseElement).toMatchSnapshot()
  })
})
