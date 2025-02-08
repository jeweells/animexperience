import { ThemeProvider } from '@mui/material/styles'
import ContinueWatching from './index'
import useResizeObserver from 'use-resize-observer'
import { MockStoreEnhanced } from 'redux-mock-store'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'
import { Provider } from 'react-redux'
import { range } from '~/src/utils'
import { EpisodeInfo } from '@shared/types'
import { FStatus } from '@shared/types'
import { ANIME_ENTRY_SELECTORS } from '@selectors'
import theme from '../../theme'

const statusTypes: FStatus[] = ['idle', 'loading', 'succeeded', 'failed']

describe('ContinueWatching', () => {
  let initialState: DeepPartial<RootState>
  let store: MockStoreEnhanced
  const useResizeObserverMock = useResizeObserver as jest.Mock
  const invokeMock = window.electron.ipcRenderer.invoke as jest.Mock
  const imageUrl = 'fake_image_url'

  const getComponent = () => {
    store = mockStore(initialState)
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <ContinueWatching />
        </ThemeProvider>
      </Provider>
    )
  }

  beforeEach(() => {
    initialState = {
      watchHistory: {
        sorted: range(5).map((n) => ({
          at: n,
          info: {
            name: 'anime name ' + n,
            date: '01/01/2022',
            episode: (n * 25454) % 63,
            img: 'anime image link ' + n,
            link: 'anime link ' + n
          }
        })),
        status: {
          sorted: 'succeeded'
        }
      },
      watched: {
        episodes: range(2).reduce((acc: Record<string, EpisodeInfo>, curr) => {
          acc['anime name ' + (curr + 1)] = {
            currentTime: 59,
            at: 101,
            duration: 600
          }
          return acc
        }, {})
      }
    }

    useResizeObserverMock.mockReturnValue({ ref: jest.fn(), width: 100, height: 100 })
    invokeMock.mockResolvedValue(imageUrl)
  })

  it.each(statusTypes.map((status) => [status]))('renders default when %s', (status) => {
    initialState.watchHistory!.status!.sorted = status as FStatus
    const wrapper = render(getComponent())
    expect(wrapper.baseElement).toMatchSnapshot()
  })

  it('fetches when mounted', () => {
    initialState.watchHistory!.status!.sorted = 'idle'
    render(getComponent())
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        type: 'watchHistory/fetchStore/pending'
      })
    )
  })

  it('calls watchEpisode when clicking on an entry', () => {
    const wrapper = render(getComponent())
    fireEvent.click(wrapper.getAllByTestId(ANIME_ENTRY_SELECTORS.HOVERABLE_AREA)[0])

    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        meta: expect.objectContaining({
          arg: initialState.watchHistory!.sorted![0].info
        }),
        type: 'watch/watchEpisode/pending'
      })
    )
  })

  it('renders when no animes have been watched', () => {
    initialState.watchHistory!.sorted = []
    const wrapper = render(getComponent())
    expect(wrapper.baseElement).toMatchSnapshot()
  })
})
