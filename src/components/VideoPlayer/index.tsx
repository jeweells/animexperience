import $ from "jquery";
import React from "react";
import useResizeObserver from "use-resize-observer";
import { useAppSelector } from "../../../redux/store";
import { Wrapper } from "../../placeholders/VideoPlayerWOptionsPlaceholder";
import { useVideoImprovements } from "./hooks";

export type VideoOption = {
    name: string;
    html: string;
}
export type VideoPlayerProps = {
    option: VideoOption | null;
}


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
    return (
        <Wrapper
            style={{
                width: "100vw",
                height: "100vh",
            }}
        >
            {children}
            {option && (
                <div
                    className={"fade-in"}
                    style={{ flex: 1, width: "100%", overflow: "hidden" }}
                    ref={(r) => {
                        setRef(r);
                        return containerRef(r);
                    }}
                    dangerouslySetInnerHTML={{ __html: option?.html }}
                />
            )}
        </Wrapper>
    );
});

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
