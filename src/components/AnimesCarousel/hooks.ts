import { useLayoutEffect, useMemo, useState } from "react";
import useResizeObserver from "use-resize-observer";

export const useSliding = (
    gap: number,
    countElements: number
) => {
    const { ref: containerRef, width: containerWidth = 1 } = useResizeObserver<HTMLDivElement>();
    const { ref: scrollerRef, width: scrollerWidth = 1 } = useResizeObserver<HTMLDivElement>();
    const { ref: prevButtonRef, width: prevButtonWidth = 1 } = useResizeObserver<any>();
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

    const handlePrev = () => {
        setViewed(viewed => Math.min(countElements, Math.max(viewed - totalInViewport, 0)));
    };

    const handleNext = () => {
        setViewed(viewed => Math.min(countElements, Math.max(viewed + totalInViewport, 0)));
    };

    const distance = useMemo(() => {
        const elementWithGap = elementWidth + gap;
        return -prevButtonWidth + elementWithGap * viewed;
    }, [viewed, elementWidth, gap, prevButtonWidth]);

    const slideProps = useMemo(() => ({
        style: { transform: `translate3d(${-distance}px, 0, 0)` }
    }), [distance]);



    const hasPrev = distance > 0;
    const hasNext = (viewed + totalInViewport) < countElements;

    return {
        prevButtonRef,
        scrollerRef,
        handlePrev,
        handleNext,
        slideProps,
        containerRef,
        hasPrev,
        hasNext
    };
};
