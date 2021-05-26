import React from "react";
import { Button } from "rsuite";
import { useRelaySelector } from "../../../redux/store";
import VideoPlayer, { VideoOption } from "../VideoPlayer";
import { Options, OptionsRow } from "../../placeholders/VideoPlayerWOptionsPlaceholder";

export type VideoPlayerWOptionsProps = {}

export const VideoPlayerWOptions: React.FC<VideoPlayerWOptionsProps> = React.memo(({
    children,
}) => {
    const options = useRelaySelector(
        d => d.watch.availableVideos,
        d => d.watch.status.availableVideos,
    );
    const [currentOption, setCurrentOption] = React.useState<VideoOption | null>(null);
    React.useLayoutEffect(() => {
        if (!currentOption && options?.[0]) {
            setCurrentOption(options[0]);
        }
    }, [options]);

    return (
        <VideoPlayer option={currentOption}>
            <OptionsRow className={"fade-in"}>
                <Options>
                    {options?.map((x, idx) => (
                        <Button
                            disabled={currentOption?.name === x?.name}
                            key={idx}
                            onClick={() => {
                                setCurrentOption(x);
                            }}
                        >
                            {x.name}
                        </Button>
                    ))}
                </Options>
                {children}
            </OptionsRow>
        </VideoPlayer>
    );
});

VideoPlayerWOptions.displayName = "VideoPlayerWOptions";

export default VideoPlayerWOptions;
