import { Provider } from 'react-redux'
import EpisodeButton, { EpisodeButtonProps } from './index'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'
import { EPISODE_BUTTON } from '@selectors'
import { MockStoreEnhanced } from 'redux-mock-store'

describe('EpisodeButton', () => {
  let initialState: DeepPartial<RootState>
  let props: EpisodeButtonProps
  let store: MockStoreEnhanced

  const getComponent = (override: Partial<EpisodeButtonProps> = {}) => {
    store = mockStore(initialState)
    return (
      <Provider store={store}>
        <EpisodeButton {...props} {...override} />
      </Provider>
    )
  }

  beforeEach(() => {
    initialState = {
      watched: {
        episodes: {
          69: {
            currentTime: 59,
            at: 101,
            duration: 600
          }
        }
      }
    }

    props = {
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
      episode: 69
    }
  })

  it('renders default', () => {
    const wrapper = render(getComponent())
    expect(wrapper.asFragment()).toMatchSnapshot()
  })

  it('click to watch should call watchEpisode with expected data', () => {
    const wrapper = render(getComponent())
    fireEvent.click(wrapper.getByTestId(EPISODE_BUTTON.WATCH_BUTTON))
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        meta: expect.objectContaining({
          arg: {
            episode: props.episode,
            name: props.info.title,
            link: 'here goes episode link (69)',
            img: props.info.image
          }
        }),
        type: 'watch/watchEpisode/pending'
      })
    )
  })
})
