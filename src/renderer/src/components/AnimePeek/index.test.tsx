import { Provider } from 'react-redux'
import AnimePeek, { AnimePeekProps } from './index'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'
import { ANIME_PEEK, IMAGE } from '@selectors'
import { MockStoreEnhanced } from 'redux-mock-store'
import useResizeObserver from 'use-resize-observer'
import { ThemeProvider } from '@mui/material'
import theme from '../../theme'

describe('AnimePeek', () => {
  let initialState: DeepPartial<RootState>
  let props: AnimePeekProps
  let store: MockStoreEnhanced
  const useResizeObserverMock = useResizeObserver as jest.Mock
  const invokeMock = window.electron.ipcRenderer.invoke as jest.Mock
  const imageUrl = 'fake_image_url'
  const onClose = jest.fn()

  const getComponent = (override: Partial<AnimePeekProps> = {}) => {
    store = mockStore(initialState)
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AnimePeek {...props} {...override} />
        </ThemeProvider>
      </Provider>
    )
  }

  beforeEach(() => {
    initialState = {
      recommendations: {
        'first recomendation': {
          status: 'succeeded',
          recommendations: [{ id: 1, image: 'recomendation 1 image', name: 'rec 1 name' }]
        },
        'second recommendation': {
          status: 'loading'
        },
        'third recommendation': {
          status: 'failed'
        },
        'fourth recommendation': {
          status: 'idle'
        }
      },
      watched: {
        episodes: {
          69: {
            currentTime: 59,
            at: 101,
            duration: 600
          }
        }
      },
      peek: {
        info: {
          description: 'here goes description',
          link: 'here goes link',
          emitted: {
            from: 69,
            to: 129
          },
          related: [
            { name: 'Related name', link: 'related link', type: 'Ova' },
            { name: 'Related name', link: 'related link', type: 'Serie' },
            { name: 'Related name', link: 'related link', type: 'Película' },
            { name: 'Related name', link: 'related link', type: 'Especial' }
          ],
          episodeLink: 'here goes episode link (here goes episode replace)',
          type: 'Serie',
          image: 'here goes image',
          episodeReplace: 'here goes episode replace',
          episodesRange: {
            max: 10,
            min: 1
          },
          otherTitles: ['title1', 'title2'],
          status: 'En emisión',
          tags: ['tag1', 'tag2'],
          thumbnail: 'here goes thumbnail',
          title: 'here goes title'
        }
      }
    }

    props = {
      contentProps: {
        style: { backgroundColor: 'red' },
        id: 'Some other prop'
      },
      onClose
    }

    useResizeObserverMock.mockReturnValue({ ref: jest.fn(), width: 100, height: 100 })
    invokeMock.mockResolvedValue(imageUrl)
    onClose.mockRestore()
  })

  it('renders default', async () => {
    const wrapper = render(getComponent())
    await waitFor(() => {
      expect(wrapper.getByTestId(IMAGE.IMAGE)).toHaveAttribute('src', imageUrl)
    })
    fireEvent.load(wrapper.getByTestId(IMAGE.IMAGE))
    expect(wrapper.asFragment()).toMatchSnapshot()
  })

  it('renders default without onClose button', async () => {
    const wrapper = render(getComponent({ onClose: undefined }))
    await waitFor(() => {
      expect(wrapper.getByTestId(IMAGE.IMAGE)).toHaveAttribute('src', imageUrl)
    })
    fireEvent.load(wrapper.getByTestId(IMAGE.IMAGE))
    expect(wrapper.asFragment()).toMatchSnapshot()
  })

  it('handles closing', async () => {
    const wrapper = render(
      getComponent({
        onClose
      })
    )
    await waitFor(() => {
      expect(wrapper.getByTestId(IMAGE.IMAGE)).toHaveAttribute('src', imageUrl)
    })
    fireEvent.click(wrapper.getByTestId(ANIME_PEEK.CLOSE_BUTTON))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
