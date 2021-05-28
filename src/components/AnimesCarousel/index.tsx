import React from "react";
import styled from "styled-components";
import { NavigationButton } from "./components/NavigationButton";
import { useSizes, useSliding } from "./hooks";


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

export type AnimesCarouselProps = {
    children?: React.ReactNode[];
}

export const AnimesCarousel: React.VFC<AnimesCarouselProps> = React.memo(({
    children,
}) => {
    const { gap, navigationWidth, containerWidth } = useSizes();
    const {
        containerRef,
        scrollerRef,
        handleNext,
        handlePrev,
        hasNext,
        hasPrev,
        slideProps,
    } = useSliding(gap, children?.length ?? 0, navigationWidth);
    return (
        <Scroller ref={scrollerRef} style={{ width: containerWidth }}>
            <NavigationButton onClick={handlePrev} disabled={!hasPrev} direction={"left"} />
            <Items ref={containerRef} gap={gap} {...slideProps}>
                {children}
            </Items>
            <NavigationButton onClick={handleNext} disabled={!hasNext} direction={"right"} />
        </Scroller>
    );
});

AnimesCarousel.displayName = "AnimesCarousel";

export default AnimesCarousel;
