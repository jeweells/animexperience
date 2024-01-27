import NextEpisodeButton, { NextEpisodeButtonProps } from './index'
import { Provider } from 'react-redux'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'
import { MockStoreEnhanced } from 'redux-mock-store'
import { NEXT_EPISODE_BUTTON } from '@selectors'
import { getCurrentWindow } from '@electron/remote'

describe('NextEpisodeButton', () => {
  let initialState: DeepPartial<RootState>
  let props: NextEpisodeButtonProps
  let store: MockStoreEnhanced
  const getUrlMock = getCurrentWindow().webContents.getURL as jest.Mock

  beforeEach(() => {
    props = {}
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
    getUrlMock.mockClear()
  })

  const getComponent = (override: Partial<NextEpisodeButtonProps> = {}) => {
    store = mockStore(initialState)
    return (
      <Provider store={store}>
        <NextEpisodeButton {...props} {...override} />
      </Provider>
    )
  }

  it('renders default', async () => {
    const wrapper = render(getComponent())
    expect(wrapper.baseElement).toMatchSnapshot()
    expect(getUrlMock).toHaveBeenCalledTimes(1)
  })

  it('renders default when not shown', async () => {
    initialState.watch!.showNextEpisodeButton = false
    const wrapper = render(getComponent())
    expect(wrapper.baseElement).toMatchSnapshot()
  })

  it('renders when the episode is the last one', async () => {
    initialState.watch!.info!.episodesRange!.max = initialState.watch!.watching!.episode!
    const wrapper = render(getComponent())
    expect(wrapper.baseElement).toMatchSnapshot()
  })

  it('renders default when timedout', async () => {
    initialState.watch!.nextEpisodeTimeout = -1
    const wrapper = render(getComponent())
    expect(wrapper.baseElement).toMatchSnapshot()
  })

  it('hides the button and calls next episode when clicking', async () => {
    const wrapper = render(getComponent())
    fireEvent.click(wrapper.getByTestId(NEXT_EPISODE_BUTTON.BUTTON))
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        payload: false,
        type: 'watch/setNextEpisodeButton'
      })
    )
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        type: 'watch/nextEpisode/pending'
      })
    )
  })
})
