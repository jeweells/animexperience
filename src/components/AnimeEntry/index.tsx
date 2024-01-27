import React from 'react'
import styled, { css } from 'styled-components'
import { pixel } from '../../utils'
import { useSizes } from '../AnimesCarousel/hooks'
import CardPopover from '../CardPopover'
import Fade from '@mui/material/Fade'
import { ANIME_ENTRY_SELECTORS } from '@selectors'

export type AnimeEntryProps = {
    index: number
    onClick?(): void
    onMouseOver?: React.HTMLAttributes<HTMLDivElement>['onMouseOver']
    onMouseOut?: React.HTMLAttributes<HTMLDivElement>['onMouseOut']
    isPopover?: boolean
    visible?: boolean
    sliding?: boolean
    render(): React.ReactNode
}

type WrapperProps = Pick<
    ReturnType<typeof useSizes>,
    'containerWidth' | 'gap' | 'navigationWidth'
>

const wrapperSize = (nElements: number, props: WrapperProps) => {
    return css`
        --width: calc(
            (
                    ${pixel(props.containerWidth)} - ${nElements - 1} *
                        ${pixel(props.gap)} - 2 * ${pixel(props.navigationWidth)}
                ) / ${nElements}
        );
        --height: calc(var(--width) * 0.94);
    `
}

// We need this since we need to be able to compute this only with CSS
const createMediaQueriesUntil = (
    props: WrapperProps,
    targetImageSize = { width: 300, height: 200 },
    maxMediaWidth = 7680,
) => {
    const queries = []

    for (let n = 1; ; n++) {
        const mediaWidth =
            targetImageSize.width * n + (n - 1) * props.gap + 2 * props.navigationWidth

        if (mediaWidth > maxMediaWidth) break
        queries.push(css`
            @media (max-width: ${mediaWidth}px) {
                ${wrapperSize(n, props)}
                ${n === 2
                    ? css`
                          --height: calc(var(--width) * 0.84);
                      `
                    : ''}
            }
        `)
    }
    return queries.reverse()
}

export const Wrapper = styled.div<WrapperProps>`
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    ${(props) => createMediaQueriesUntil(props)}
    width: var(--width);
    height: var(--height);
    flex: 0 0 auto;
    cursor: pointer;
    transition: all 300ms ease-in-out;
    display: flex;
    flex-direction: column;

    &:hover {
        //transform: scale(1.1);
        z-index: 10;
    }
`

export const AnimeEntry = React.memo<AnimeEntryProps>(
    ({
        onClick,
        onMouseOver,
        onMouseOut,
        isPopover,
        index,
        visible,
        sliding,
        render,
    }) => {
        const { navigationWidth, containerWidth, gap } = useSizes()
        const cardRef = React.useRef<HTMLDivElement>(null)
        const [isHovered, setIsHovered] = React.useState<boolean>(false)
        React.useLayoutEffect(() => {
            if (sliding) {
                setIsHovered(false)
            }
        }, [sliding, isHovered])
        const handleMouseOver = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            onMouseOver?.(e)
            if (!sliding) {
                setIsHovered(true)
            }
        }

        return (
            <Fade
                data-testid={ANIME_ENTRY_SELECTORS.WRAPPER}
                in={true}
                timeout={1000 + Math.min(5000, 500 * index)}
                appear={!isPopover}
            >
                <div>
                    <Wrapper
                        data-testid={ANIME_ENTRY_SELECTORS.HOVERABLE_AREA}
                        ref={cardRef}
                        onClick={onClick}
                        onMouseOver={handleMouseOver}
                        onMouseOut={onMouseOut}
                        gap={gap}
                        containerWidth={containerWidth}
                        navigationWidth={navigationWidth}
                    >
                        {render()}
                    </Wrapper>
                    {!isPopover && (
                        <AnimeEntryPopover
                            index={index}
                            open={isHovered}
                            visible={visible}
                            onMouseOver={handleMouseOver}
                            onClick={onClick}
                            cardRef={cardRef}
                            sliding={sliding}
                            onClose={() => {
                                setIsHovered(false)
                            }}
                            render={render}
                        />
                    )}
                </div>
            </Fade>
        )
    },
)

AnimeEntry.displayName = 'AnimeEntry'

type AnimeEntryPopoverProps = {
    open: boolean
    onMouseOut?: React.HTMLAttributes<HTMLDivElement>['onMouseOver']
    onMouseOver?: React.HTMLAttributes<HTMLDivElement>['onMouseOut']
    cardRef?: React.RefObject<HTMLElement>
    onClose?(): void
} & Pick<AnimeEntryProps, 'onClick' | 'index' | 'visible' | 'sliding' | 'render'>

const AnimeEntryPopover: React.VFC<AnimeEntryPopoverProps> =
    React.memo<AnimeEntryPopoverProps>(
        ({
            open,
            cardRef,
            onClick,
            onMouseOut,
            onMouseOver,
            onClose,
            index,
            visible,
            sliding,
            render,
        }) => {
            return (
                <CardPopover
                    open={Boolean(!sliding && visible && open)}
                    anchorEl={cardRef}
                    onClose={onClose}
                >
                    <AnimeEntry
                        isPopover={true}
                        onClick={onClick}
                        onMouseOut={onMouseOut}
                        onMouseOver={onMouseOver}
                        index={index}
                        visible={visible}
                        sliding={sliding}
                        render={render}
                    />
                </CardPopover>
            )
        },
    )

AnimeEntryPopover.displayName = 'AnimeEntryPopover'

export default AnimeEntry
