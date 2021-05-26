import React from "react";
import { Button } from "rsuite";
import styled from "styled-components";
import { useSliding } from "./hooks";


const Scroller = styled.div`
    overflow-x: hidden;
    position: relative;
`;

const Items = styled.div<{ gap: number; }>`
    display: flex;
    width: min-content;
    gap: ${props => props.gap}px;
    transition: all 400ms ease-in-out;
`;

const NavContainer = styled.div`
    position: absolute;
    top: 0;
    background-color: rgba(0,0,0,0.3);
    z-index: 10;
`;

const NextContainer = styled(NavContainer)`
    right: 0;
`;

const PrevContainer = styled(NavContainer)`
    left: 0;
`;

export type AnimesCarouselProps = {
    children?: React.ReactNode[];
}

export const AnimesCarousel: React.VFC<AnimesCarouselProps> = React.memo(({
    children,
}) => {
    const gap = 16;
    const {
        containerRef,
        scrollerRef,
        handleNext,
        handlePrev,
        hasNext,
        hasPrev,
        slideProps,
    } = useSliding(gap, children?.length ?? 0);
    return (
        <Scroller ref={scrollerRef}>
            <PrevContainer>
                <Button onClick={handlePrev} disabled={!hasPrev}>
                    Prev
                </Button>
            </PrevContainer>
            <Items ref={containerRef} gap={gap} {...slideProps}>
                {children}
            </Items>
            <NextContainer>
                <Button onClick={handleNext} disabled={!hasNext}>
                    Next
                </Button>
            </NextContainer>
        </Scroller>
    );
});

AnimesCarousel.displayName = "AnimesCarousel";

export default AnimesCarousel;
