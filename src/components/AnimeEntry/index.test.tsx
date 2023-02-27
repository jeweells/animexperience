import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { AnimeEntry, AnimeEntryProps } from './index'

describe('AnimeDetailsEntry', () => {
    const returnTestId = 'render-return'
    const props = {
        onClick: jest.fn(),
        onMouseOut: jest.fn(),
        onMouseOver: jest.fn(),
        render: jest.fn(() => <div data-testid={returnTestId} />),
        isPopover: false,
        index: 0,
        visible: false,
        sliding: false,
    }
    beforeEach(() => {
        props.onClick.mockClear()
        props.onMouseOut.mockClear()
        props.onMouseOver.mockClear()
        props.render.mockClear()
    })

    const getComponent = (override: Partial<AnimeEntryProps> = {}) => (
        <AnimeEntry {...props} {...override} />
    )

    it('renders default', async () => {
        const wrapper = render(getComponent())
        await waitFor(() => expect(wrapper.getByTestId(returnTestId)).toBeInTheDocument())
        expect(props.render).toHaveBeenCalled()
        expect(wrapper.asFragment()).toMatchSnapshot()
    })

    it.each([1, 2])(
        'should take longer to appear as long as index (%s) increases',
        async (index) => {
            const wrapper = render(getComponent({ index }))
            await waitFor(() =>
                expect(wrapper.getByTestId(returnTestId)).toBeInTheDocument(),
            )
            expect(wrapper.asFragment()).toMatchSnapshot()
        },
    )

    it('renders when its a popover', async () => {
        const wrapper = render(getComponent({ isPopover: true }))
        await waitFor(() => expect(wrapper.getByTestId(returnTestId)).toBeInTheDocument())
        expect(wrapper.asFragment()).toMatchSnapshot()
    })

    it('renders when its hovered', async () => {
        // TODO: Implement, popover should be visible
    })

    it('renders when its hovered but sliding', async () => {
        // TODO: Implement, popover should be hidden
    })
})
