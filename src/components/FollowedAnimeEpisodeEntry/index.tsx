import { Fade } from '@material-ui/core'
import React from 'react'
import { AnimeLinkToEpisode } from '../../../electron/linkBuilder'
import { FollowedAnimeWStatus } from '../../../redux/reducers/followedAnimes'
import AnimeEntryPlaceholder from '../../placeholders/AnimeEntryPlaceholder'
import { AnimeEpisodeEntry, AnimeEpisodeEntryProps } from '../AnimeEpisodeEntry'

export type FollowedAnimeEpisodeEntryProps = Omit<AnimeEpisodeEntryProps, 'anime'> & {
    followed: FollowedAnimeWStatus
}

export const FollowedAnimeEpisodeEntry: React.FC<FollowedAnimeEpisodeEntryProps> =
    React.memo<FollowedAnimeEpisodeEntryProps>(({ followed, ...rest }) => {
        const anime = React.useMemo(() => {
            if (!followed) return {}
            return {
                name: followed.name,
                link: new AnimeLinkToEpisode(followed.link, 'animeid').withEpisode(
                    followed.nextEpisodeToWatch,
                ),
                episode: followed.nextEpisodeToWatch,
                img: followed.image,
            }
        }, [followed])
        if (followed?.status !== 'succeeded') {
            return (
                <Fade in={true} timeout={2000 + 500 * rest.index} appear={true}>
                    <div>
                        <AnimeEntryPlaceholder
                            style={{
                                opacity: 1 - rest.index * 0.2,
                            }}
                        />
                    </div>
                </Fade>
            )
        }
        return <AnimeEpisodeEntry anime={anime} {...rest} />
    })

FollowedAnimeEpisodeEntry.displayName = 'FollowedAnimeEpisodeEntry'

export default FollowedAnimeEpisodeEntry
