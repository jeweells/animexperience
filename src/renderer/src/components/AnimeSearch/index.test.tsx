import { ThemeProvider } from '@mui/material/styles'
import { Provider } from 'react-redux'
import AnimeSearch, { AnimeSearchProps } from './index'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'
import { MockStoreEnhanced } from 'redux-mock-store'
import { range } from '~/src/utils'
import { ANIME_ENTRY_SELECTORS, ANIME_SEARCH, WAYPOINT } from '@selectors'
import theme from '../../theme'

describe('AnimeSearch', () => {
  let initialState: DeepPartial<RootState>
  let props: AnimeSearchProps
  let store: MockStoreEnhanced
  const onClose = jest.fn()

  const getComponent = (override: Partial<AnimeSearchProps> = {}) => {
    store = mockStore(initialState)
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AnimeSearch {...props} {...override} />
        </ThemeProvider>
      </Provider>
    )
  }

  beforeEach(() => {
    initialState = {
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

  it('calls onClose', () => {
    const wrapper = render(getComponent())
    fireEvent.click(wrapper.getByTestId(ANIME_SEARCH.CLOSE_BUTTON))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('tries to open an anime result', () => {
    const wrapper = render(getComponent())
    fireEvent.click(wrapper.getAllByTestId(ANIME_ENTRY_SELECTORS.HOVERABLE_AREA)[0])
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        meta: expect.objectContaining({
          arg: initialState.animeSearch!.result!.matches![0].name
        }),
        type: 'peek/peek/pending'
      })
    )
  })

  it('calls search more when activating waypoint', () => {
    const wrapper = render(getComponent())
    fireEvent.scroll(wrapper.getByTestId(WAYPOINT.DIV))
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        meta: expect.objectContaining({
          arg: undefined
        }),
        type: 'animeSearch/searchMore/pending'
      })
    )
  })

  it("doesn't call search more when activating waypoint and there are not any more results", () => {
    initialState.animeSearch!.result!.hasNext = false
    const wrapper = render(getComponent())
    fireEvent.scroll(wrapper.getByTestId(WAYPOINT.DIV))

    expect(store.getActions()).toEqual([])
  })

  it('renders default when no results', () => {
    initialState.animeSearch!.result = {
      hasNext: false,
      search: initialState.animeSearch!.result!.search,
      matches: []
    }
    const wrapper = render(getComponent())
    expect(wrapper.baseElement).toMatchSnapshot()
  })

  it('renders default when loading', () => {
    initialState.animeSearch!.status!.result = 'loading'
    const wrapper = render(getComponent())
    expect(wrapper.baseElement).toMatchSnapshot()
  })

  it('renders default when loading more', () => {
    initialState.animeSearch!.status!.moreResults = 'loading'
    const wrapper = render(getComponent())
    expect(wrapper.baseElement).toMatchSnapshot()
  })
})
