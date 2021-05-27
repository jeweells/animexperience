import { Fade } from "@material-ui/core";
import { Skeleton, SkeletonProps } from "@material-ui/lab";
import React from "react";
import styled from "styled-components";
import { FCol, FRow } from "../../atoms/Layout";
import { range } from "../../utils";

export const Wrapper = styled(FCol)`
    position: relative;
    width: 100%;
    height: 100%;
    gap: 16px;
`;

export const Options = styled(FRow)`
    position: relative;
    overflow: hidden;
    flex: 1;
    gap: 16px;
    > * {
        flex: 0 0 auto;
    }
`;
export const OptionsRow = styled(FRow)`
    padding: 16px 16px 0 16px;
`;


const FullScreenClip: React.FC<{ id: string, size: number }> = React.memo(({ id, size }) => {
    const width = size * 0.10;
    const length = size * 0.3;
    const points = (arr: [number, number][]) => {
        return arr.map(x => x.map(x => x).join(" ")).join(", ");
    };
    return (
        <svg width={"0"} height={"0"} style={{ position: "fixed", top: 0, left: 0 }}>
            <defs>
                <clipPath id={id}>
                    <polygon points={points([
                        [0, 0],
                        [0, length],
                        [width, length],
                        [width, width],
                        [length, width],
                        [length, 0]
                    ])}
                    />
                    <polygon points={points([
                        [size, 0],
                        [size, length],
                        [size - width, length],
                        [size - width, width],
                        [size - length, width],
                        [size - length, 0]
                    ])}
                    />
                    <polygon points={points([
                        [size, size],
                        [size, size - length],
                        [size - width, size - length],
                        [size - width, size - width],
                        [size - length, size - width],
                        [size - length, size]
                    ])}
                    />
                    <polygon points={points([
                        [0, size],
                        [0, size - length],
                        [width, size - length],
                        [width, size - width],
                        [length, size - width],
                        [length, size]
                    ])}
                    />
                </clipPath>
            </defs>
        </svg>
    );
});
FullScreenClip.displayName = "FullScreenClip";

export type VideoPlayerWOptionsPlaceholderProps = {}

export const VideoPlayerWOptionsPlaceholder: React.FC<VideoPlayerWOptionsPlaceholderProps> = React.memo(({
    children
}) => {
    const animation: SkeletonProps["animation"] = "pulse";
    return (
        <Fade in={true} timeout={1000}>
            <Wrapper>
                <OptionsRow>
                    <Options>
                        {range(5).map(x => (
                            <div
                                key={x}
                                style={{
                                    height: "100%",
                                    width: 80,
                                    opacity: 1 - x * 0.2
                                }}
                            >
                                <Skeleton
                                    animation={animation}
                                    height={"100%"}
                                    variant={"rect"}
                                    width={80}
                                    style={{
                                        borderRadius: 8,
                                    }}
                                />
                            </div>
                        ))}
                    </Options>
                    {children}
                </OptionsRow>
                <Skeleton animation={animation} variant={"rect"} style={{ flex: 1 }} />
                <div style={{
                    alignItems: "center",
                    display: "flex",
                    minHeight: 24 + 16,
                    padding: 16,
                    paddingTop: 0,
                    gap: "16px",
                }}
                >
                    <Skeleton
                        animation={animation}
                        variant={"rect"}
                        width={20}
                        height={20}
                        style={{
                            marginLeft: 4,
                            clipPath: "polygon(100% 50%, 0 0, 0 100%)",
                        }}
                    />
                    <Skeleton
                        animation={animation}
                        variant={"rect"}
                        height={10}
                        style={{
                            flex: 1,
                            borderRadius: 8,
                        }}
                    />
                    <FullScreenClip size={24} id={"fullScreenClip"} />
                    <Skeleton
                        animation={animation}
                        variant={"rect"}
                        width={24}
                        height={24}
                        style={{
                            clipPath: "url(#fullScreenClip)",
                        }}
                    />
                </div>
            </Wrapper>
        </Fade>
    );
});

VideoPlayerWOptionsPlaceholder.displayName = "VideoPlayerWOptionsPlaceholder";

export default VideoPlayerWOptionsPlaceholder;
