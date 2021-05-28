import React, { Fragment } from "react";
import styled, { css } from "styled-components";
import { AnimeDescription, AnimeTitle } from "../../atoms/Text";
import { RecentAnimeData } from "../../hooks/useRecentAnimes";
import { Optional } from "../../types";
import { pixel } from "../../utils";
import { useSizes } from "../AnimesCarousel/hooks";
import CardPopover from "../CardPopover";

export type AnimeEntryProps = {
    anime: Optional<RecentAnimeData>;
    onClick?(anime: RecentAnimeData): void;
    onMouseOver?: React.HTMLAttributes<HTMLDivElement>["onMouseOver"];
    onMouseOut?: React.HTMLAttributes<HTMLDivElement>["onMouseOut"];
    isPopover?: boolean;
};



type WrapperProps = Pick<ReturnType<typeof useSizes>, "containerWidth" | "gap" | "navigationWidth">;

const wrapperSize = (nElements: number, props: WrapperProps) => {
    return css`
        --width: calc((${
    pixel(props.containerWidth)} - ${nElements - 1} * ${
    pixel(props.gap)} - 2*${
    pixel(props.navigationWidth)})/${nElements});
        --height: calc(var(--width) * 0.64);
    `;
};

export const Wrapper = styled.div<WrapperProps>`
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    ${props => wrapperSize(4, props)};
    @media (max-width: 1000px) {
        ${props => wrapperSize(3, props)};
    }
    @media (max-width: 800px) {
        ${props => wrapperSize(2, props)};
        --height: calc(var(--width) * 0.84);
    }
    @media (max-width: 500px) {
        ${props => wrapperSize(1, props)};
    }
    width: var(--width);
    height: var(--height);
    flex: 0 0 auto;
    cursor: pointer;
    transition: all 300ms ease-in-out;
    &:hover {
        //transform: scale(1.1);
        z-index: 10;
    }
`;

const AnimeInfo = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    background-image: linear-gradient(to top,rgba(0,0,0,0.7),rgba(0,0,0,0.5) 20%,rgba(0,0,0,0) 40%);
    padding: 16px;
`;
const Img = styled.img`
    object-fit: cover;
    width: 100%;
    height: 100%;
`;

export const AnimeEntry = React.memo<AnimeEntryProps>(({
    anime,
    onClick,
    onMouseOver,
    onMouseOut,
    isPopover,
}) => {
    const { navigationWidth, containerWidth, gap } = useSizes();
    const cardRef = React.useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = React.useState<boolean>(false);
    if (!anime) return null;
    const handleMouseOver = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        onMouseOver?.(e);
        setIsHovered(true);
    };
    const handleClick = () => {
        onClick?.(anime);
    };

    return (
        <Fragment>
            <Wrapper
                ref={cardRef}
                onClick={handleClick}
                onMouseOver={handleMouseOver}
                onMouseOut={onMouseOut}
                gap={gap}
                containerWidth={containerWidth}
                navigationWidth={navigationWidth}
            >
                <Img alt={anime.name} src={anime.img}/>
                <AnimeInfo>
                    <AnimeTitle>
                        {anime.name}
                    </AnimeTitle>
                    <AnimeDescription>
                        {`Episodio ${anime.episode}`}
                    </AnimeDescription>
                </AnimeInfo>
            </Wrapper>
            {!isPopover && (
                <AnimeEntryPopover
                    open={isHovered}
                    anime={anime}
                    onMouseOver={handleMouseOver}
                    onClick={handleClick}
                    cardRef={cardRef}
                    onClose={() => {
                        setIsHovered(false);
                    }}
                />
            )}
        </Fragment>
    );
});

AnimeEntry.displayName = "AnimeEntry";

type AnimeEntryPopoverProps = {
    open: boolean;
    onMouseOut?:React.HTMLAttributes<HTMLDivElement>["onMouseOver"];
    onMouseOver?:React.HTMLAttributes<HTMLDivElement>["onMouseOut"];
    cardRef?: React.RefObject<HTMLElement>;
    onClose?(): void;
} & Pick<AnimeEntryProps, "anime" | "onClick">

const AnimeEntryPopover: React.VFC<AnimeEntryPopoverProps> = React.memo<AnimeEntryPopoverProps>(({
    open,
    cardRef,
    anime,
    onClick,
    onMouseOut,
    onMouseOver,
    onClose,
}) => {
    return (
        <CardPopover
            open={open}
            anchorEl={cardRef}
            onClose={onClose}
        >
            <AnimeEntry
                isPopover={true}
                anime={anime}
                onClick={onClick}
                onMouseOut={onMouseOut}
                onMouseOver={onMouseOver}
            />
        </CardPopover>
    );
});


AnimeEntryPopover.displayName = "AnimeEntryPopover";

export default AnimeEntry;
