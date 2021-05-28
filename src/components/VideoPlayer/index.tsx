import $ from "jquery";
import React from "react";
import useResizeObserver from "use-resize-observer";
import { useAppSelector } from "../../../redux/store";
import { FCol } from "../../atoms/Layout";
import { Wrapper } from "../../placeholders/VideoPlayerWOptionsPlaceholder";
import NextEpisodeButton from "../NextEpisodeButton";
import { useVideoImprovements } from "./hooks";

export type VideoOption = {
    name: string;
    html: string;
}
export type VideoPlayerProps = {
    option: VideoOption | null;
}


const IFrame: React.FC<{
    html?: string;
    updateRef?(r: HTMLDivElement | null): void;
}> = React.memo(({
    html,
    updateRef,
    children,
}) => {
    if (!html) return null;
    return (
        <FCol
            className={"fade-in"}
            style={{ flex: 1, containerWidth: "100%", overflow: "hidden", position: "relative" }}
            ref={updateRef}
        >
            <div
                style={{ flex: 1, containerWidth: "100%", overflow: "hidden" }}
                ref={updateRef}
                dangerouslySetInnerHTML={{ __html: html }}
            />
            {children}
        </FCol>
    );
});

IFrame.displayName = "IFrame";

export const VideoPlayer: React.FC<VideoPlayerProps> = React.memo(({
    option,
    children,
}) => {
    const [ref, setRef] = React.useState<HTMLDivElement | null>(null);
    const watching = useAppSelector(d => d.watch.watching);
    const { ref: containerRef, width = 1, height = 1 } = useResizeObserver<HTMLDivElement>();
    React.useLayoutEffect(() => {
        if (!ref) return;
        const iframe = $(ref).find("iframe");
        if (!iframe) return;
        iframe.attr("width", Math.floor(width) - 1);
        iframe.attr("height", Math.floor(height) - 1);
    }, [ref, option?.name, width, height]);
    useVideoImprovements({
        anime: watching,
        option,
    }, ref);

    const updateWrapperRef = React.useCallback((r) => {
        setRef(r);
        return containerRef(r);
    }, []);
    return (
        <Wrapper
            style={{
                containerWidth: "100vw",
                height: "100vh",
            }}
        >
            {children}
            {option && (
                <IFrame
                    html={option?.html}
                    updateRef={updateWrapperRef}
                >
                    <NextEpisodeButton />
                </IFrame>
            )}
        </Wrapper>
    );
});

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
