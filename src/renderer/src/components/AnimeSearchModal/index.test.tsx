import { ThemeProvider } from '@mui/material/styles'
import { Provider } from 'react-redux'
import AnimeSearchModal, { AnimeSearchModalProps } from './index'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'
import { MockStoreEnhanced } from 'redux-mock-store'
import { range } from '~/src/utils'
import { TopView } from '@shared/types'
import theme from '../../theme'

describe('AnimeSearchModal', () => {
  let initialState: DeepPartial<RootState>
  let props: AnimeSearchModalProps
  let store: MockStoreEnhanced
  const onClose = jest.fn()

  const getComponent = (override: Partial<AnimeSearchModalProps> = {}) => {
    store = mockStore(initialState)
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AnimeSearchModal {...props} {...override} />
        </ThemeProvider>
      </Provider>
    )
  }

  beforeEach(() => {
    initialState = {
      topView: {
        views: [TopView.SEARCH]
      },
      animeSearch: {
        status: {
          result: 'succeeded',
          moreResults: 'succeeded'
        },
        result: {
          hasNext: true,
          search: 'anime name to search',
          matches: range(12).map((n) => ({
            image: 'image url ' + n,
            link: 'anime link ' + n,
            name: 'anime name ' + n
          })),
          maxPage: 5,
          nextPage: 2
        }
      }
    }

    props = {
      onClose
    }
    onClose.mockReset()
  })

  it('renders default', () => {
    const wrapper = render(getComponent())
    expect(wrapper.baseElement).toMatchSnapshot()
  })

  it('should not render when is not the corresponding top view', () => {
    initialState.topView!.views = []
    const wrapper = render(getComponent())
    // asFragment() won't work since the modal is outside the react root element
    expect(wrapper.baseElement).toMatchSnapshot()
  })

  it('closing it should pop topView', () => {
    render(getComponent())
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        type: 'topView/pop'
      })
    )
  })
})
