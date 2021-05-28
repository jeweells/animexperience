import React from "react";
import { watch } from "../../../redux/reducers/watch";
import { useAppDispatch } from "../../../redux/store";
import { RecentAnimeData, useRecentAnimes } from "../../hooks/useRecentAnimes";
import AnimeEntry from "../AnimeEntry";
import { AnimesCarousel } from "../AnimesCarousel";
import { AnimeCarouselContent } from "../../placeholders/AnimeCarouselContent";

export type RecentAnimesProps = {}

export const RecentAnimes: React.FC<RecentAnimesProps> = React.memo(({

}) => {
    const {
        data: recentAnimes,
        status
    } = useRecentAnimes();
    const dispatch = useAppDispatch();

    const filteredAnimes = recentAnimes
        ?.flat(1)
        .filter((x): x is RecentAnimeData => !!x);

    const count = status !== "succeeded" ? 5 : filteredAnimes?.length ?? 5;

    return (
        <React.Fragment>
            <AnimesCarousel count={count} loading={status !== "succeeded"}>
                {status !== "succeeded"
                    ? <AnimeCarouselContent count={count} />
                    : (
                        filteredAnimes
                            ?.map(x => {
                                return (
                                    <AnimeEntry
                                        key={`${x.name} ${x.episode}`}
                                        anime={x}
                                        onClick={(anime) => {
                                            if (anime.name && anime.episode) {
                                                dispatch(watch.watchEpisode(anime));
                                            } else {
                                                console.error("No enough data to perform search");
                                            }
                                        }}
                                    />
                                );
                            })
                    )
                }
            </AnimesCarousel>
        </React.Fragment>
    );
});

RecentAnimes.displayName = "RecentAnimes";

export default RecentAnimes;
