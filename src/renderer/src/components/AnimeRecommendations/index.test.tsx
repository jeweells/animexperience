import { Provider } from 'react-redux'
import AnimeRecommendations, { AnimeRecommendationsProps } from './index'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'
import { MockStoreEnhanced } from 'redux-mock-store'
import useResizeObserver from 'use-resize-observer'
import { RecommendationsState } from '~/redux/state/types'
import theme from '../../theme'
import { ThemeProvider } from '@mui/material'

describe.each([[0], [0.5]])('AnimeRecommendations (random: %s)', (randomValue) => {
  let initialState: DeepPartial<RootState>
  const defaultRecommendations: DeepPartial<RecommendationsState> = {
    'anime name 1': {
      status: 'succeeded',
      recommendations: [{ id: 1, image: 'recomendation 1 image', name: 'rec 1 name' }]
    },
    'anime name 2': {
      status: 'loading'
    },
    'anime name 3': {
      status: 'failed'
    },
    'anime name 4': {
      status: 'idle'
    }
  }
  let props: AnimeRecommendationsProps
  let store: MockStoreEnhanced
  const useResizeObserverMock = useResizeObserver as jest.Mock
  const invokeMock = window.electron.ipcRenderer.invoke as jest.Mock
  const imageUrl = 'fake_image_url'

  const getComponent = (override: Partial<AnimeRecommendationsProps> = {}) => {
    store = mockStore(initialState)
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AnimeRecommendations {...props} {...override} />
        </ThemeProvider>
      </Provider>
    )
  }

  beforeAll(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(randomValue)
  })

  beforeEach(() => {
    initialState = {
      recommendations: {
        ...defaultRecommendations
      }
    }

    props = {
      animeName: 'anime name 1'
    }

    useResizeObserverMock.mockReturnValue({ ref: jest.fn(), width: 100, height: 100 })
    invokeMock.mockResolvedValue(imageUrl)
  })

  Object.entries(defaultRecommendations || {}).forEach(([animeName, recommendation]) => {
    it('renders default when ' + recommendation!.status, () => {
      const wrapper = render(getComponent({ animeName }))
      expect(wrapper.baseElement).toMatchSnapshot()
    })
  })

  it('fetches recommendations when mounted', () => {
    render(getComponent({ animeName: 'anime name 4' }))
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        meta: expect.objectContaining({
          arg: 'anime name 4'
        }),
        type: 'recommendations/fetchRecommendations/pending'
      })
    )
  })
})
