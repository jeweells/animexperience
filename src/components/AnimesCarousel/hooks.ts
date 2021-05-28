import React, { useLayoutEffect, useMemo, useState } from "react";
import useResizeObserver from "use-resize-observer";

export const useSliding = (
    gap: number,
    countElements: number,
    prevButtonWidth: number,
) => {
    const { ref: containerRef, width: containerWidth = 1 } = useResizeObserver<HTMLDivElement>();
    const { ref: scrollerRef, width: scrollerWidth = 1 } = useResizeObserver<HTMLDivElement>();
    const [totalInViewport, setTotalInViewport] = useState(0);
    const [viewed, setViewed] = useState(0);
    const availableScrollerWidth = scrollerWidth - prevButtonWidth;

    const elementWidth = useMemo(() => {
        return (containerWidth - gap * (countElements - 1)) / countElements;
    }, [countElements, gap, containerWidth]);
    useLayoutEffect(() => {
        const elementWidthWithGap = elementWidth + gap;

        let visibleElementsCount = Math.floor(availableScrollerWidth / elementWidthWithGap);
        if (elementWidthWithGap * visibleElementsCount + elementWidth <= availableScrollerWidth) {
            visibleElementsCount++;
        }
        setTotalInViewport(visibleElementsCount);
    }, [availableScrollerWidth, elementWidth]);

    const [sliding, setSliding] = React.useState<boolean>(false);
    const handlePrev = () => {
        if (!sliding) {
            setViewed(viewed => Math.min(countElements, Math.max(viewed - totalInViewport, 0)));
        }
    };

    const handleNext = () => {
        if (!sliding) {
            setViewed(viewed => Math.min(countElements, Math.max(viewed + totalInViewport, 0)));
        }
    };

    const distance = useMemo(() => {
        const elementWithGap = elementWidth + gap;
        return -prevButtonWidth + elementWithGap * viewed;
    }, [viewed, elementWidth, gap, prevButtonWidth]);
    const mounted = React.useRef(false);
    React.useLayoutEffect(() => {
        if (mounted.current) {
            setSliding(true);
        }
        mounted.current = true;
    }, [distance]);

    const slideProps = useMemo<Partial<React.HTMLAttributes<HTMLElement>>>(() => ({
        style: {
            transform: `translate3d(${-distance}px, 0, 0)`,
            // These will be unset when the transition ends
            pointerEvents: sliding ? "none" : "all",
        },
    }),
    // Do not depend it on distance; very important! Otherwise, 1 frame will be inconsistent
    [sliding]);



    const hasPrev = distance > 0;
    const hasNext = (viewed + totalInViewport) < countElements;

    return {
        scrollerRef,
        handlePrev,
        handleNext,
        slideProps,
        containerRef,
        hasPrev,
        hasNext,
        sliding,
        viewed,
        totalInViewport,
        onSlidingComplete: () => {
            console.debug("Sliding finished");
            setSliding(false);
        },
    };
};


const defaultSizes = {
    gap: 16,
    containerWidth: "100vw",
    navigationWidth: 72,
};

export const useSizes = () => {
    return defaultSizes;
};
