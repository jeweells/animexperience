import React, { useCallback, useRef } from 'react'
import { Icon, IconButton } from 'rsuite'
import { peek } from '../../../redux/reducers/peek'
import { useAppDispatch, useAppSelector } from '../../../redux/store'
import { FRowG16 } from '../../atoms/Layout'
import { FExpand } from '../../atoms/Misc'
import { CarouselTitle } from '../../atoms/Text'
import { Optional } from '../../types'
import { AnimeDetails, AnimeDetailsEntry } from '../AnimeDetailsEntry'
import Fade from '@material-ui/core/Fade'
import { Content, Wrapper } from '../AnimePeek'
import { ContentContext } from '../Topbar'

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
            console.debug('CLICKED', anime)
        },
        [dispatch],
    )
    console.debug('CARD POPOVER UPDATE ---- RENDERING')
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
                                style={{ fontSize: '1.5rem', whiteSpace: 'pre' }}
                            >
                                Resultados de{' '}
                                <span style={{ opacity: 0.8 }}>{result?.search}</span>
                            </CarouselTitle>
                            <FExpand />
                            <IconButton
                                onClick={onClose}
                                icon={<Icon icon={'close'} size={'lg'} />}
                                size={'lg'}
                            />
                        </FRowG16>
                        {resultStatus !== 'succeeded' && 'LOADING::::'}
                        <FRowG16
                            style={{
                                flexWrap: 'wrap',
                            }}
                        >
                            {result?.matches.map((match, idx) => {
                                return (
                                    <AnimeDetailsEntry
                                        key={idx}
                                        visible={true}
                                        onClick={handleAnimePeek}
                                        anime={match}
                                        // This index manages opacity animation timeout
                                        index={idx % 36}
                                    />
                                )
                            })}
                        </FRowG16>
                        {moreResultsStatus === 'loading' && 'LOADING MOREE::::'}
                    </Content>
                </Wrapper>
            </Fade>
        </ContentContext.Provider>
    )
})

AnimeSearch.displayName = 'AnimeSearch'

export default AnimeSearch
