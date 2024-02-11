import NextEpisodeButton from './index'
import { Provider } from 'react-redux'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'
import { MockStoreEnhanced } from 'redux-mock-store'
import { NEXT_EPISODE_BUTTON } from '@selectors'

describe('NextEpisodeButton', () => {
  let initialState: DeepPartial<RootState>
  let store: MockStoreEnhanced

  beforeEach(() => {
    initialState = {
      watch: {
        showNextEpisodeButton: true,
        nextEpisodeTimeout: 5,
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
        },
        watching: {
          date: '01/01/2022',
          episode: 5,
          img: 'image link',
          link: 'anime link',
          name: 'anime name'
        }
      }
    }
  })

  const getComponent = () => {
    store = mockStore(initialState)
    return (
      <Provider store={store}>
        <NextEpisodeButton />
      </Provider>
    )
  }

  it('renders default', async () => {
    const wrapper = render(getComponent())
    expect(wrapper.baseElement).toMatchSnapshot()
  })

  it('renders default when not shown', async () => {
    initialState.watch!.showNextEpisodeButton = false
    const wrapper = render(getComponent())
    expect(wrapper.baseElement).toMatchSnapshot()
  })

  it('do not show when the episode is the last one', async () => {
    initialState.watch!.info!.episodesRange!.max = initialState.watch!.watching!.episode!
    const wrapper = render(getComponent())
    expect(wrapper.baseElement).toMatchSnapshot()
  })

  it('calls next episode when clicking', async () => {
    const wrapper = render(getComponent())
    fireEvent.click(wrapper.getByTestId(NEXT_EPISODE_BUTTON.BUTTON))

    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        type: 'watch/nextEpisode/pending'
      })
    )
  })
})
