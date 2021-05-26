import React from "react";
import styled from "styled-components";
import { RecentAnimeData } from "../../hooks/useRecentAnimes";

export type AnimeEntryProps = {
  anime: RecentAnimeData;
  onClick?(anime: RecentAnimeData): void;
}

const Wrapper = styled.div`
    border: 2px solid white;
    padding: 10px;
`;


export const AnimeEntry: React.FC<AnimeEntryProps> = React.memo(({
    anime,
    onClick,
}) => {
    return (
        <Wrapper onClick={async () => {
            onClick?.(anime);
        }}
        >
            <div>
                {`${anime.name} - ${anime.episode}`}
                {anime.date}
            </div>
            <div>
                <img alt={anime.name} src={anime.img}/>
            </div>
        </Wrapper>
    );
});

AnimeEntry.displayName = "AnimeEntry";

export default AnimeEntry;
