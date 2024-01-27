import AnimesCarousel, { AnimesCarouselProps } from './index'
import TopLayout from '../../../plugins/gatsby-plugin-top-layout/TopLayout'
import useResizeObserver from 'use-resize-observer'
import { ipcRenderer } from 'electron'

describe('AnimesCarousel', () => {
  let props: AnimesCarouselProps
  const useResizeObserverMock = useResizeObserver as jest.Mock
  const invokeMock = ipcRenderer.invoke as jest.Mock
  const imageUrl = 'fake_image_url'

  const getComponent = (override: Partial<AnimesCarouselProps> = {}) => {
    return (
      <TopLayout>
        <AnimesCarousel {...props} {...override} />
      </TopLayout>
    )
  }

  beforeEach(() => {
    props = {
      count: 5,
      loading: false,
      title: 'Sample title',
      render: (info) => <div key={info.index}>{JSON.stringify(info, null, 2)}</div>
    }

    useResizeObserverMock.mockReturnValue({ ref: jest.fn(), width: 100, height: 100 })
    invokeMock.mockResolvedValue(imageUrl)
  })

  it.each([[false], [true]])('renders default when %s', (loading) => {
    const wrapper = render(getComponent({ loading }))
    expect(wrapper.baseElement).toMatchSnapshot()
  })
})
