import React from 'react'
import { AnimeEpisodeEntry, AnimeEpisodeEntryProps } from './index'
import { ANIME_ENTRY_SELECTORS, ANIME_EPISODE_ENTRY } from '@selectors'
import { Provider } from 'react-redux'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'

describe('AnimeEpisodeEntry', () => {
    const returnTestId = ANIME_EPISODE_ENTRY.ANIME_INFO
    let initialState: DeepPartial<RootState>
    const props = {
        onClick: jest.fn(),
        onMouseOut: jest.fn(),
        onMouseOver: jest.fn(),
        anime: {
            name: 'Here goes the anime name',
            img: 'Here goes the anime image url',
            link: 'Here goes the anime link',
            episode: 69,
            date: "Here goes the date (I think it's not used anymore)",
        },
        management: {
            follow: false,
        },
        isPopover: false,
        index: 0,
        visible: false,
        sliding: false,
    }
    beforeEach(() => {
        initialState = {
            watched: {
                episodes: {
                    69: {
                        currentTime: 59,
                        at: 101,
                        duration: 600,
                    },
                },
            },
            followedAnimes: {
                followedDict: {
                    [props.anime.name]: {
                        name: props.anime.name,
                        image: props.anime.img,
                        link: 'Here goes anime link',
                        lastCheckAt: 1,
                        lastEpisodeWatched: 2,
                        lastSuccessAt: 3,
                        nextCheckAt: 4,
                        nextEpisodeToWatch: 5,
                    },
                },
            },
        }
        props.onClick.mockClear()
        props.onMouseOut.mockClear()
        props.onMouseOver.mockClear()
    })

    const getComponent = (override: Partial<AnimeEpisodeEntryProps> = {}) => {
        return (
            <Provider store={mockStore(initialState)}>
                <AnimeEpisodeEntry {...props} {...override} />
            </Provider>
        )
    }

    it('renders default', async () => {
        const wrapper = render(getComponent())
        await waitFor(() => expect(wrapper.getByTestId(returnTestId)).toBeInTheDocument())
        // Since most tests depends on this component, make sure it's there
        expect(wrapper.getByTestId(ANIME_ENTRY_SELECTORS.WRAPPER)).toBeInTheDocument()
        expect(wrapper.asFragment()).toMatchSnapshot()
    })

    it('renders when has follow management', async () => {
        const wrapper = render(
            getComponent({ management: { ...props.management, follow: true } }),
        )
        await waitFor(() => expect(wrapper.getByTestId(returnTestId)).toBeInTheDocument())
        // Since most tests depends on this component, make sure it's there
        expect(wrapper.getByTestId(ANIME_ENTRY_SELECTORS.WRAPPER)).toBeInTheDocument()
        expect(wrapper.asFragment()).toMatchSnapshot()
    })

    it('renders without anime', async () => {
        const wrapper = render(getComponent({ anime: null }))
        expect(wrapper.asFragment()).toMatchSnapshot()
    })

    it('should pass anime on click', async () => {
        const wrapper = render(getComponent())
        await waitFor(() => expect(wrapper.getByTestId(returnTestId)).toBeInTheDocument())
        fireEvent.click(wrapper.getByTestId(ANIME_ENTRY_SELECTORS.HOVERABLE_AREA))
        expect(props.onClick).toHaveBeenCalledWith(props.anime)
    })
})
