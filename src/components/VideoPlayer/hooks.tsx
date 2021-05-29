import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Store } from "../../../globals/types";
import { watch } from "../../../redux/reducers/watch";
import store, { useAppDispatch } from "../../../redux/store";
import { RecentAnimeData } from "../../hooks/useRecentAnimes";
import { useStaticStore } from "../../hooks/useStaticStore";
import { Optional } from "../../types";
import NextEpisodeButton from "../NextEpisodeButton";
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
        const video = iframe.find("video");
        if (video.length === 0) {
            console.debug("GOT", playBtn);
            playBtn.trigger("click");
            // Let it spam or else it won't work
            return false;
        }
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
    const [detachedVideo, setDetachedVideo] = React.useState<Optional<HTMLVideoElement>>(null);
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
                    const jTargetVideo = $(targetVideo);
                    jTargetVideo.on("DOMNodeRemoved", () => {
                        if (jTargetVideo.parent().length === 0) {
                            console.debug("VIDEO DETACHED");
                            setVideo(p => {
                                if (p === targetVideo) {
                                    jTargetVideo.off("DOMNodeRemoved", "**");
                                    return null;
                                }
                                return p;
                            });
                            setDetachedVideo(targetVideo);
                        }
                    });
                    clearInterval(interval.handle);
                }
            };
            interval.handle = setInterval(check, ms);
            check();
            return () => {
                clearInterval(interval.handle);
            };
        }
    }, [info.anime?.name, info.anime?.episode, info.option?.name, container, ms, detachedVideo]);

    return video;
};


const SECONDS_LEFT_TO_NEXT_EPISODE = 5;
const SECONDS_LEFT_TO_TRIGGER_NEXT_EPISODE = 1;
const SECONDS_NEXT_BUTTON_DISPLAY = SECONDS_LEFT_TO_NEXT_EPISODE - SECONDS_LEFT_TO_TRIGGER_NEXT_EPISODE;

export const useVideoImprovements = (info: BasicVideoInfo, container: Optional<HTMLDivElement>) => {
    const video = useVideo(info, container);
    const dispatch = useAppDispatch();
    const staticStore = useStaticStore(Store.WATCHED);
    React.useLayoutEffect(() => {
        if (video) {
            if (!video.autoplay) {
                video.autoplay = true;
            }
            if (video.paused) {
                video.play();
            }
            const refs: {
                nextButtonShown?: boolean;
                nextBtnRef?: JQuery | null;
            } = {};
            const handleTimeUpdate = () => {
                if (isFinite(video.duration)) {
                    const { duration, currentTime } = video;
                    console.debug("VIDEO TIME", video.currentTime);
                    if (currentTime + SECONDS_LEFT_TO_NEXT_EPISODE >= duration) {
                        const timeoutToNextEpisode = Math.max(
                            0,
                            duration - (currentTime + SECONDS_LEFT_TO_TRIGGER_NEXT_EPISODE)
                        );
                        if (timeoutToNextEpisode === 0) {
                            // With timeout -1 auto play next episode is disabled (user probable moved the mouse)
                            if (store.getState().watch.nextEpisodeTimeout !== -1) {
                                dispatch(watch.nextEpisode());
                                refs.nextButtonShown = false;
                                dispatch(watch.setNextEpisodeButton(false));
                            }
                        } else if (!refs.nextButtonShown) {
                            refs.nextButtonShown = true;
                            dispatch(watch.setNextEpisodeButton(true));
                            dispatch(watch.setNextEpisodeTimeout(SECONDS_NEXT_BUTTON_DISPLAY));
                        }
                    } else if (refs.nextButtonShown) {
                        refs.nextButtonShown = false;
                        dispatch(watch.setNextEpisodeButton(false));
                    }
                    const anime = info.anime;
                    if (anime &&
                        anime.name &&
                        typeof anime.episode === "number" &&
                        // Save each 5 seconds
                        Math.floor(video.duration) % 5 === 0
                    ) {
                        staticStore.set(anime.name, anime.episode, {
                            duration: video.duration,
                            currentTime: video.currentTime,
                            at: new Date().getTime(),
                        });
                    }
                }
            };
            console.debug("VIDEO", video);
            const handleMouseMove = () => {
                dispatch(watch.setNextEpisodeTimeout(-1));
            };
            const handleFullScreen = () => {
                // document.fullscreenElement will point to the element that
                // is in fullscreen mode if there is one. If there isn't one,
                // the value of the property is null.
                let targetElement: Optional<Element> = document.fullscreenElement;
                // The target fullscreen element changes depending on the iframe we're in
                // It's needed to find an non iframe element to attach the button
                // so that its visible in fullscreen mode
                while (targetElement?.tagName.toLowerCase() === "iframe" && "contentDocument" in targetElement) {
                    // targetElement instanceof HTMLIFrameElement does not work for iframes
                    // Alternative: Use iframe.contentWindow.HTMLIFrameElement
                    // However, this might be a cleaner way
                    targetElement = (targetElement as HTMLIFrameElement).contentDocument?.fullscreenElement;
                }
                if (targetElement) {
                    const jTargetElement = $(targetElement as HTMLElement);
                    console.debug("Setting fullscreen");
                    const root = refs.nextBtnRef || $("<div id='raex-injected-root' />");
                    if (!root.parent().is(jTargetElement)) {
                        refs.nextBtnRef = root;
                        console.debug("Attaching node to element");
                        jTargetElement.append(root);
                        ReactDOM.render(
                            <Provider store={store}>
                                <NextEpisodeButton />
                            </Provider>,
                            root.get(0)
                        );
                    } else {
                        console.debug("Element already attached");
                    }
                } else {
                    console.debug("Deleting node");
                    refs.nextBtnRef?.remove();
                    refs.nextBtnRef = null;
                }
            };
            document.addEventListener("fullscreenchange", handleFullScreen);
            video.addEventListener("mousemove", handleMouseMove);
            video.addEventListener("timeupdate", handleTimeUpdate);
            return () => {
                video.removeEventListener("timeupdate", handleTimeUpdate);
                video.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("fullscreenchange", handleFullScreen);
            };
        }
    }, [video]);
};
