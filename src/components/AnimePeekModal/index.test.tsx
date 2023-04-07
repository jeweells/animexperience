import { Provider } from 'react-redux'
import AnimePeekModal, { AnimePeekModalProps } from './index'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'
import React from 'react'
import { ANIME_PEEK, IMAGE } from '@selectors'
import { MockStoreEnhanced } from 'redux-mock-store'
import TopLayout from '../../../plugins/gatsby-plugin-top-layout/TopLayout'
import useResizeObserver from 'use-resize-observer'
import { ipcRenderer } from 'electron'
import { FStatus, TopView } from '~/src/types'

const statusTypes: FStatus[] = ['idle', 'loading', 'succeeded', 'failed']

describe('AnimePeekModal', () => {
    let initialState: DeepPartial<RootState>
    let props: AnimePeekModalProps
    let store: MockStoreEnhanced
    const useResizeObserverMock = useResizeObserver as jest.Mock
    const invokeMock = ipcRenderer.invoke as jest.Mock
    const imageUrl = 'fake_image_url'

    const getComponent = (override: Partial<AnimePeekModalProps> = {}) => {
        store = mockStore(initialState)
        return (
            <TopLayout>
                <Provider store={store}>
                    <AnimePeekModal {...props} {...override} />
                </Provider>
            </TopLayout>
        )
    }

    beforeEach(() => {
        initialState = {
            topView: {
                views: [TopView.PEEK],
            },
            recommendations: {
                'first recomendation': {
                    status: 'succeeded',
                    recommendations: [
                        { id: 1, image: 'recomendation 1 image', name: 'rec 1 name' },
                    ],
                },
                'second recommendation': {
                    status: 'loading',
                },
                'third recommendation': {
                    status: 'failed',
                },
                'fourth recommendation': {
                    status: 'idle',
                },
            },
            watched: {
                episodes: {
                    69: {
                        currentTime: 59,
                        at: 101,
                        duration: 600,
                    },
                },
            },
            peek: {
                peeking: TopView.PEEK,
                status: {
                    info: 'succeeded',
                },
                info: {
                    description: 'here goes description',
                    link: 'here goes link',
                    emitted: {
                        from: 69,
                        to: 129,
                    },
                    related: [
                        { name: 'Related name', link: 'related link', type: 'Ova' },
                        { name: 'Related name', link: 'related link', type: 'Serie' },
                        { name: 'Related name', link: 'related link', type: 'Película' },
                        { name: 'Related name', link: 'related link', type: 'Especial' },
                    ],
                    episodeLink: 'here goes episode link (here goes episode replace)',
                    type: 'Serie',
                    image: 'here goes image',
                    episodeReplace: 'here goes episode replace',
                    episodesRange: {
                        max: 10,
                        min: 1,
                    },
                    otherTitles: ['title1', 'title2'],
                    status: 'En emisión',
                    tags: ['tag1', 'tag2'],
                    thumbnail: 'here goes thumbnail',
                    title: 'here goes title',
                },
            },
        }

        props = {}

        useResizeObserverMock.mockReturnValue({ ref: jest.fn(), width: 100, height: 100 })
        invokeMock.mockResolvedValue(imageUrl)
    })

    it.each(statusTypes.map((status) => [status]))(
        'renders default when %s',
        async (infoStatus) => {
            initialState.peek!.status!.info = infoStatus as FStatus
            const wrapper = render(getComponent())
            if (infoStatus === 'succeeded') {
                await waitFor(() => {
                    expect(wrapper.getByTestId(IMAGE.IMAGE)).toHaveAttribute(
                        'src',
                        imageUrl,
                    )
                })
                fireEvent.load(wrapper.getByTestId(IMAGE.IMAGE))
            }
            // asFragment() won't work since the modal is outside the react root element
            expect(wrapper.baseElement).toMatchSnapshot()
        },
    )

    it('should not render when is not the corresponding top view', async () => {
        initialState.topView!.views = []
        const wrapper = render(getComponent())
        // asFragment() won't work since the modal is outside the react root element
        expect(wrapper.baseElement).toMatchSnapshot()
    })

    it('closing it should stop peeking', async () => {
        const wrapper = render(getComponent())
        await waitFor(() => {
            expect(wrapper.getByTestId(IMAGE.IMAGE)).toHaveAttribute('src', imageUrl)
        })
        fireEvent.load(wrapper.getByTestId(IMAGE.IMAGE))
        fireEvent.click(wrapper.getByTestId(ANIME_PEEK.CLOSE_BUTTON))
        expect(store.getActions()).toContainEqual(
            expect.objectContaining({
                payload: undefined,
                type: 'peek/setPeeking',
            }),
        )
    })
})
