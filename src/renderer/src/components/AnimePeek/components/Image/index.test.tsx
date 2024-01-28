import Image, { ImageProps } from './index'
import { IMAGE } from '@selectors'
import theme from '../../../../theme'
import { ThemeProvider } from '@mui/material'

const invokeNames = window.invokeNames

describe('Image', () => {
  let props: ImageProps
  const imageUrl = 'fake_image_url.png'
  const oldImageUrl = 'old_image_url.png'
  const invokeMock = window.electron.ipcRenderer.invoke as jest.Mock

  const getComponent = (override: Partial<ImageProps> = {}) => {
    return (
      <ThemeProvider theme={theme}>
        <Image {...props} {...override} />
      </ThemeProvider>
    )
  }

  beforeEach(() => {
    props = {
      animeName: 'Any anime name',
      src: oldImageUrl
    }
    invokeMock.mockResolvedValue(imageUrl)
  })

  it('renders default', async () => {
    const wrapper = render(getComponent())

    expect(invokeMock).toHaveBeenCalledWith(invokeNames.getAnimeImage.name, props.animeName)
    await waitFor(() => {
      expect(wrapper.getByTestId(IMAGE.IMAGE)).toHaveAttribute('src', imageUrl)
    })
    fireEvent.load(wrapper.getByTestId(IMAGE.IMAGE))
    expect(wrapper.getByTestId(IMAGE.BG_IMAGE)).toBeInTheDocument()
    expect(wrapper.getByTestId(IMAGE.BG_IMAGE)).toHaveAttribute('src', oldImageUrl)
    expect(wrapper.getByTestId(IMAGE.BLUR)).toHaveStyle('opacity: 0')
    expect(wrapper.asFragment()).toMatchSnapshot()
  })

  it('renders loading', () => {
    invokeMock.mockResolvedValue(new Promise(() => null))
    const wrapper = render(getComponent())
    expect(wrapper.getByTestId(IMAGE.BLUR)).toHaveStyle('opacity: 1')
    expect(wrapper.queryByTestId(IMAGE.IMAGE)).toBeNull()
  })
})
