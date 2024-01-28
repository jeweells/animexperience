import EpisodeNavigation from './index'
import { MockStoreEnhanced } from 'redux-mock-store'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'
import { Provider } from 'react-redux'
import { TopView } from '@shared/types'
import { EPISODE_NAVIGATION } from '@selectors'
import theme from '../../theme'
import { ThemeProvider } from '@mui/material'

describe('EpisodeNavigation', () => {
  let initialState: DeepPartial<RootState>
  let store: MockStoreEnhanced

  const getComponent = () => {
    store = mockStore(initialState)
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <EpisodeNavigation />
        </ThemeProvider>
      </Provider>
    )
  }

  beforeEach(() => {
    initialState = {
      watch: {
        watching: {
          name: 'here goes title',
          date: '01/01/2022',
          episode: 5,
          img: 'here goes image',
          link: 'here goes episode link (5)'
        },
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
      },
      topView: {
        views: [TopView.PLAYER]
      }
    }
  })

  it('renders default', () => {
    const wrapper = render(getComponent())
    expect(wrapper.baseElement).toMatchSnapshot()
  })

  it('freezes player when using another modal', () => {
    initialState.topView!.views = [TopView.SEARCH]
    render(getComponent())
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        payload: true,
        type: 'player/freeze'
      })
    )
  })

  it("doesn't freeze player when using player modal", () => {
    render(getComponent())
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        payload: false,
        type: 'player/freeze'
      })
    )
  })

  it('calls previousEpisode when clicking left arrow', () => {
    const wrapper = render(getComponent())
    fireEvent.click(wrapper.getByTestId(EPISODE_NAVIGATION.PREVIOUS_EPISODE_BUTTON))
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        type: 'watch/previousEpisode/pending'
      })
    )
  })

  it('calls nextEpisode when clicking right arrow', () => {
    const wrapper = render(getComponent())
    fireEvent.click(wrapper.getByTestId(EPISODE_NAVIGATION.NEXT_EPISODE_BUTTON))
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        type: 'watch/nextEpisode/pending'
      })
    )
  })

  it('calls peeking anime when clicking menu icon', () => {
    const wrapper = render(getComponent())
    fireEvent.click(wrapper.getByTestId(EPISODE_NAVIGATION.ANIME_DETAILS_BUTTON))
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        meta: expect.objectContaining({
          arg: initialState.watch!.watching!.name
        }),
        type: 'peek/peek/pending'
      })
    )
  })
})
