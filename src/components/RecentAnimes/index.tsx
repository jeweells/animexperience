import React from "react";
import { player } from "../../../redux/reducers/player";
import { watch } from "../../../redux/reducers/watch";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { RecentAnimeData, useRecentAnimes } from "../../hooks/useRecentAnimes";
import AnimeEntry from "../AnimeEntry";
import { AnimesCarousel } from "../AnimesCarousel";

export type RecentAnimesProps = {}

export const RecentAnimes: React.FC<RecentAnimesProps> = React.memo(({

}) => {
    const {
        data: recentAnimes,
        status
    } = useRecentAnimes();
    const dispatch = useAppDispatch();
    const waching = useAppSelector(d => d.watch.watching);

    return (
        <React.Fragment>
            {status !== "succeeded" ? "Loading"
                : (
                    <AnimesCarousel>
                        {recentAnimes
                            ?.flat(1)
                            .filter((x): x is RecentAnimeData => !!x)
                            .map(x => {
                                return (
                                    <AnimeEntry

                                        key={`${x.name} ${x.episode}`}
                                        anime={x}
                                        onClick={(anime) => {
                                            if (waching) return;
                                            if (anime.name && anime.episode) {
                                                dispatch(watch.set(anime));
                                                dispatch(watch.getAvailableVideos());
                                                dispatch(player.show());
                                            } else {
                                                console.error("No enough data to perform search");
                                            }
                                        }}
                                    />
                                );
                            })}
                    </AnimesCarousel>
                )
            }
        </React.Fragment>
    );
});

RecentAnimes.displayName = "RecentAnimes";

export default RecentAnimes;
