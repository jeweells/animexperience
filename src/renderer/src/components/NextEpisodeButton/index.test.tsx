import NextEpisodeButton from './index'
import { Provider } from 'react-redux'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'
import { MockStoreEnhanced } from 'redux-mock-store'
import { NEXT_EPISODE_BUTTON } from '@selectors'
import { useControls } from '@components/VideoPlayer/components/Controls/hooks'
import { SECONDS_LEFT_TO_NEXT_EPISODE } from '@components/VideoPlayer/constants'
import { act } from '@testing-library/react'

jest.spyOn(global, 'clearTimeout')

describe('NextEpisodeButton', () => {
  let initialState: DeepPartial<RootState>
  let store: MockStoreEnhanced
  const vid = useControls().video!
  const getCurrentTime = Object.getOwnPropertyDescriptor(vid, 'currentTime')?.get as jest.Mock
  const getDuration = Object.getOwnPropertyDescriptor(vid, 'duration')?.get as jest.Mock

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

    getCurrentTime.mockReturnValue(getDuration() - SECONDS_LEFT_TO_NEXT_EPISODE + 1)
    getDuration.mockClear()
    ;(clearTimeout as jest.Mock).mockClear()
  })

  afterEach(() => {
    getCurrentTime.mockReset()
  })

  const getComponent = () => {
    store = mockStore(initialState)
    return (
      <Provider store={store}>
        <NextEpisodeButton />
      </Provider>
    )
  }

  it('renders default (not shown)', async () => {
    getCurrentTime.mockReturnValue(0)
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

  it('renders when the episode looks like it has ended', async () => {
    const wrapper = render(getComponent())

    expect(wrapper.baseElement).toMatchSnapshot()
  })

  it('stop timer when user moves the mouse', async () => {
    render(getComponent())
    fireEvent.mouseMove(document)
    expect(clearTimeout).toHaveBeenCalledTimes(1)
  })

  it('stop timer when user pauses the video', async () => {
    render(getComponent())
    expect(clearTimeout).not.toHaveBeenCalled()
    const events = useControls().video?.addEventListener as jest.Mock
    const pausedCalls = events.mock.calls.filter((call) => call[0] === 'pause')
    const getPaused = Object.getOwnPropertyDescriptor(vid, 'duration')?.get as jest.Mock
    getPaused.mockReturnValue(true)
    act(() => {
      pausedCalls.forEach((call) => call[1]())
    })
    expect(clearTimeout).toHaveBeenCalledTimes(pausedCalls.length)
    getPaused.mockReset()
  })
})
