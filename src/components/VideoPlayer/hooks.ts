import React from "react";
import $ from "jquery";
import { RecentAnimeData } from "../../hooks/useRecentAnimes";
import { Optional } from "../../types";
import { VideoOption } from "./index";
type $IframeContents = JQuery<HTMLIFrameElement | Text | Comment | Document>;

// Target must be iframe.contents() ... always
function * deepIframes (
    target: $IframeContents,
    depth = 5,
    currDepth = 1
): Generator<$IframeContents> {
    if (!target || target.length === 0 || currDepth >= depth) return;
    if (currDepth === 1) {
        yield target;
    }
    const iframes = target.find("iframe").get().map(x => $(x).contents());
    for (const iframe of iframes) {
        yield iframe;
    }
    for (const iframe of iframes) {
        for (const t of deepIframes(iframe, depth, currDepth + 1)) {
            yield t;
        }
    }
}

// The array returned will always be of length greater than 0
const deepFindVideos = (target: $IframeContents, depth = 5): Optional<HTMLVideoElement[]> => {
    for (const iframe of deepIframes(target, depth)) {
        const video = iframe.find("video");
        if (video.length > 0) {
            return video.get();
        }
    }
};


const handleSpecificOptions = (option: Optional<VideoOption>, contents: $IframeContents): boolean => {
    const methods: Partial<Record<string, (contents: $IframeContents) => boolean>> = {
        "fembed": handleFembedPlayer,
        "okru": handleOkRuPlayer,
        "mixdrop": handleMixDrop,
    };
    const handler = methods[option?.name?.toLowerCase() ?? ""];
    if (handler) {
        for (const iframe of deepIframes(contents)) {
            if (handler(iframe)) {
                return true;
            }
        }
    }

    return false;
};

const handleFembedPlayer = (iframe: $IframeContents) => {
    console.debug("Fembed: Clicking play button");
    const playBtn = iframe.find(".faplbu");
    if (playBtn.length > 0) {
        console.debug("GOT", playBtn);
        playBtn.trigger("click");
        return true;
    }
    return false;
};

const handleOkRuPlayer = (iframe: $IframeContents) => {
    console.debug("Okru: Clicking play button");
    const playBtn = iframe.find("div#embedVideoC.vid-card_cnt_w");
    if (playBtn.length > 0) {
        console.debug("GOT", playBtn);
        playBtn.trigger("click");
        // Let it spam or else it won't work
        return false;
    }
    return false;
};

const handleMixDrop = (iframe: $IframeContents) => {
    let adClicked = false;
    for (const adClick of iframe.find("div[onclick]").get()) {
        const onclick = adClick.getAttribute("onclick");
        if (onclick && onclick.includes("$(this).remove()")) {
            $(adClick).trigger("click");
            adClicked = true;
        }
    }
    if (!adClicked) {
        iframe.find("button.vjs-big-play-button").trigger("click");
    }
    return false;
};

export type BasicVideoInfo = {
    option?: Optional<VideoOption>;
    anime?: Optional<RecentAnimeData>;
}

export const useVideo = (info: BasicVideoInfo, container: Optional<HTMLDivElement>, ms = 300) => {
    const [video, setVideo] = React.useState<Optional<HTMLVideoElement>>(null);
    React.useLayoutEffect(() => {
        if (container) {
            const interval: { handle?: number; handledSpecificOptions?: boolean } = {};
            const iframeContent = $(container).find("iframe");
            const check = () => {
                const contents = iframeContent.contents();
                if (!interval.handledSpecificOptions) {
                    interval.handledSpecificOptions = handleSpecificOptions(info.option, contents);
                }
                const video = deepFindVideos(contents);
                console.debug("Trying to find video: ", video);
                const targetVideo = video?.find(vid => {
                    const jVid = $(vid);
                    if (jVid.attr("src")) {
                        return true;
                    } else if (jVid.find("source[src]").length) {
                        return true;
                    }
                    return false;
                });
                if (targetVideo) {
                    setVideo(targetVideo);
                    clearInterval(interval.handle);
                }
            };
            interval.handle = setInterval(check, ms);
            check();
            return () => {
                clearInterval(interval.handle);
            };
        }
    }, [info.anime?.name, info.anime?.episode, info.option?.name, container, ms]);

    return video;
};


export const useVideoImprovements = (info: BasicVideoInfo, container: Optional<HTMLDivElement>) => {
    const video = useVideo(info, container);
    React.useLayoutEffect(() => {
        if (video) {
            $(video).attr("autoplay", "true");
            video.play();
            const handleTimeUpdate = () => {
                console.debug("VIDEO TIME", video.currentTime);
            };
            video.addEventListener("timeupdate", handleTimeUpdate);
            return () => {
                video.removeEventListener("timeupdate", handleTimeUpdate);
            };
        }
    }, [video]);
};
