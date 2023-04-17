import CardPopover, { CardPopoverProps } from './index'
import React from 'react'
import TopLayout from '../../../plugins/gatsby-plugin-top-layout/TopLayout'
import { ContentContext } from '@components/Topbar'

describe('CardPopover', () => {
    let props: CardPopoverProps
    const onClose = jest.fn()

    beforeAll(() => {
        jest.spyOn(
            window.HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(
            () =>
                ({
                    bottom: 100,
                    height: 100,
                    left: 0,
                    right: 100,
                    top: 0,
                    width: 100,
                    toJSON() {
                        return {
                            bottom: 100,
                            height: 100,
                            left: 0,
                            right: 100,
                            top: 0,
                            width: 100,
                        }
                    },
                } as DOMRect),
        )
    })

    const getComponent = (override: Partial<CardPopoverProps> = {}) => {
        const Wrapper: React.FC = () => {
            const containerRef = React.useRef<HTMLDivElement>(null)
            const anchorRef = React.useRef<HTMLDivElement>(null)
            return (
                <ContentContext.Provider value={containerRef}>
                    <div ref={containerRef}>[ContainerRef]</div>
                    <div ref={anchorRef}>[AnchorRef]</div>
                    <CardPopover {...props} {...override} anchorEl={anchorRef} />
                </ContentContext.Provider>
            )
        }
        Wrapper.displayName = 'WrapperMock'
        return (
            <TopLayout>
                <Wrapper />
            </TopLayout>
        )
    }

    beforeEach(() => {
        props = {
            open: true,
            onClose,
            children: <div>[Children]</div>,
        }
        onClose.mockReset()
    })

    it('renders default', () => {
        const wrapper = render(getComponent())
        expect(wrapper.baseElement).toMatchSnapshot()
    })

    it('renders when closed', () => {
        const wrapper = render(getComponent({ open: false }))
        expect(wrapper.baseElement).toMatchSnapshot()
    })

    it('closes when dropping hover', () => {
        render(getComponent())
        fireEvent.mouseMove(document)
        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('keeps popover when mouse is hovering', async () => {
        const matchesSpy = jest
            .spyOn(window.Element.prototype, 'matches')
            .mockImplementation(() => true)
        render(getComponent())
        fireEvent.mouseMove(document)
        expect(onClose).toHaveBeenCalledTimes(0)
        matchesSpy.mockRestore()
    })
})
