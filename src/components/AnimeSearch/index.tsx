import React, { useCallback, useRef } from 'react'
import { Waypoint } from 'react-waypoint'
import { animeSearch, peek } from '@reducers'

import { useAppDispatch, useAppSelector } from '~/redux/utils'
import CloseButton from '../../atoms/CloseButton'
import { FRowG16 } from '../../atoms/Layout'
import { FExpand } from '../../atoms/Misc'
import { CarouselTitle } from '../../atoms/Text'
import AnimeSearchPlaceholder from '../../placeholders/AnimeSearchPlaceholder'
import { Optional } from '../../types'
import { AnimeDetails, AnimeDetailsEntry } from '../AnimeDetailsEntry'
import { Content, Wrapper } from '../AnimePeek'
import { ContentContext } from '../Topbar'
import Fade from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import { ANIME_SEARCH } from '@selectors'

export type AnimeSearchProps = {
    onClose?(): void
}

export const AnimeSearch: React.FC<AnimeSearchProps> = React.memo(({ onClose }) => {
    const resultStatus = useAppSelector((d) => d.animeSearch.status.result)
    const moreResultsStatus = useAppSelector((d) => d.animeSearch.status.moreResults)
    const result = useAppSelector((d) => d.animeSearch.result)
    const contentRef = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch()
    const handleAnimePeek = useCallback(
        (anime: Optional<AnimeDetails>) => {
            if (!anime) return
            dispatch(peek.peek(anime.name))
        },
        [dispatch],
    )
    return (
        <ContentContext.Provider value={contentRef}>
            <Fade in={true} appear={true} timeout={1000}>
                <Wrapper ref={contentRef}>
                    <Content
                        style={{
                            padding: '32px 64px',
                        }}
                    >
                        <FRowG16 style={{ alignItems: 'center' }}>
                            <CarouselTitle
                                style={{
                                    fontSize: '1.5rem',
                                    whiteSpace: 'pre',
                                }}
                            >
                                {result?.matches.length !== 0 ? (
                                    <>
                                        Resultados de{' '}
                                        <span style={{ opacity: 0.8 }}>
                                            &quot;{result?.search}&quot;
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        No hay resultados para{' '}
                                        <span style={{ opacity: 0.8 }}>
                                            &quot;{result?.search}&quot;
                                        </span>
                                    </>
                                )}
                            </CarouselTitle>
                            <FExpand />
                            <CloseButton
                                data-testid={ANIME_SEARCH.CLOSE_BUTTON}
                                onClick={onClose}
                            />
                        </FRowG16>
                        <Grid container spacing={2}>
                            {resultStatus === 'succeeded' ? (
                                <>
                                    {result?.matches.map((match, idx) => {
                                        return (
                                            <Grid
                                                item
                                                key={idx}
                                                lg={3}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <AnimeDetailsEntry
                                                    visible={true}
                                                    onClick={handleAnimePeek}
                                                    anime={match}
                                                    // This index manages opacity animation timeout
                                                    index={idx % 36}
                                                />
                                            </Grid>
                                        )
                                    })}
                                    {['idle', 'succeeded'].includes(
                                        moreResultsStatus ?? 'idle',
                                    ) ? (
                                        <Waypoint
                                            onEnter={() => {
                                                if (result?.hasNext) {
                                                    dispatch(animeSearch.searchMore())
                                                }
                                            }}
                                        />
                                    ) : (
                                        <AnimeSearchPlaceholder count={12} />
                                    )}
                                </>
                            ) : (
                                <AnimeSearchPlaceholder count={36} />
                            )}
                        </Grid>
                    </Content>
                </Wrapper>
            </Fade>
        </ContentContext.Provider>
    )
})

AnimeSearch.displayName = 'AnimeSearch'

export default AnimeSearch
