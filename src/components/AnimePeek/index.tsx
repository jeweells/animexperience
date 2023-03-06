import moment from 'moment'
import React, { useRef } from 'react'
import styled from 'styled-components'
import { AnimeInfo } from '~/globals/types'
import { useAppSelector } from '~/redux/utils'
import CloseButton from '../../atoms/CloseButton'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded'
import TvRoundedIcon from '@mui/icons-material/TvRounded'
import {
    FCol,
    FColG16,
    FColG32,
    FColG8,
    FRow,
    FRowG16,
    FRowG32,
} from '../../atoms/Layout'
import { FExpand } from '../../atoms/Misc'
import { AnimePeekTitle, AnimePeekType } from '../../atoms/Text'
import AnimeRecommendations from '../AnimeRecommendations'
import { ContentContext } from '../Topbar'
import Episodes from './components/Episodes'
import Image from './components/Image'
import Info from './components/Info'
import RelatedAnimeButton from './components/RelatedAnimeButton'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'
import { Optional } from '../../types'
import ShareAnimeButton from '../ShareAnimeButton'

export const TitleRow = styled(FRow)`
    align-items: center;
    gap: 16px;
`

export const ImageCol = styled(FColG16)`
    min-width: 300px;
    max-width: 300px;
`

const SDivider = styled(Divider)`
    margin-left: 16px;
    margin-right: 16px;
    opacity: 0.5;
`

export const Wrapper = styled(FColG16)`
    overflow-y: overlay;
    padding-bottom: 32px;
    height: 100%;
    position: relative;
`

export const Content = styled(FColG16)`
    padding: 32px 64px;
`

export type AnimePeekProps = {
    onClose?(): void
    contentProps?: React.ComponentProps<typeof Content>
}

export type UnhookedAnimePeek = AnimePeekProps & {
    info: Optional<AnimeInfo>
}

export const UnhookedAnimePeek: React.FC<UnhookedAnimePeek> = React.memo(
    ({ onClose, info, contentProps }) => {
        const contentRef = useRef<HTMLDivElement>(null)
        if (!info) return null
        return (
            <ContentContext.Provider value={contentRef}>
                <Fade in={true} appear={true} timeout={1000}>
                    <Wrapper ref={contentRef} style={{ overflowX: 'hidden' }}>
                        <Content
                            {...contentProps}
                            style={{
                                padding: '32px 64px',
                                ...contentProps?.style,
                            }}
                        >
                            <FCol>
                                <TitleRow>
                                    <AnimePeekTitle>{info.title}</AnimePeekTitle>
                                    <AnimePeekType>{info.type}</AnimePeekType>
                                    <FExpand />
                                    {onClose && <CloseButton onClick={onClose} />}
                                </TitleRow>
                                {(info.otherTitles?.length ?? 0) > 0 && (
                                    <AnimePeekType>
                                        {info.otherTitles?.join(', ')}
                                    </AnimePeekType>
                                )}
                            </FCol>
                            <FRowG32>
                                <ImageCol>
                                    <div style={{ position: 'relative' }}>
                                        {info.title && (
                                            <Image
                                                animeName={info.title}
                                                src={info.image}
                                                containerStyle={{
                                                    width: '100%',
                                                    overflow: 'hidden',
                                                    borderRadius: 8,
                                                    height: 425,
                                                }}
                                                style={{
                                                    width: '100%',
                                                    height: 425,
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        )}
                                        <ShareAnimeButton
                                            style={{
                                                bottom: 16,
                                                left: 16,
                                                position: 'absolute',
                                            }}
                                        />
                                        <Button
                                            style={{
                                                pointerEvents: 'none',
                                                backgroundColor: (
                                                    {
                                                        'En emisión': '#3d773d',
                                                        Finalizada: 'darkred',
                                                    } as Record<
                                                        Required<AnimeInfo>['status'],
                                                        string
                                                    >
                                                )[info.status ?? 'Finalizada'],
                                                bottom: 16,
                                                right: 16,
                                                position: 'absolute',
                                            }}
                                        >
                                            {info.status}
                                        </Button>
                                    </div>
                                    <SDivider />
                                    <FRowG16 style={{ flexWrap: 'wrap' }}>
                                        {info.tags?.map((tag) => {
                                            return <Button key={tag}>{tag}</Button>
                                        })}
                                    </FRowG16>
                                    <SDivider />
                                    {typeof info.emitted?.from === 'number' && (
                                        <React.Fragment>
                                            <Info
                                                icon={<CalendarTodayRoundedIcon />}
                                                title={'Emitido'}
                                            >
                                                {`${moment
                                                    .unix(info.emitted.from)
                                                    .format('DD/MM/YYYY')}`}
                                            </Info>
                                        </React.Fragment>
                                    )}
                                    {Array.isArray(info.related) &&
                                        info.related.length > 0 && (
                                            <React.Fragment>
                                                <SDivider />
                                                <Info
                                                    icon={<AccountTreeRoundedIcon />}
                                                    title={'Relacionado'}
                                                >
                                                    <FColG8>
                                                        {info.related.map(
                                                            (related, idx) => {
                                                                return (
                                                                    <RelatedAnimeButton
                                                                        key={idx}
                                                                        related={related}
                                                                    />
                                                                )
                                                            },
                                                        )}
                                                    </FColG8>
                                                </Info>
                                            </React.Fragment>
                                        )}
                                </ImageCol>
                                <FColG32 style={{ flex: 1 }}>
                                    <Info icon={<MenuRoundedIcon />} title={'Sinopsis'}>
                                        <div style={{ textAlign: 'justify' }}>
                                            {info.description}
                                        </div>
                                    </Info>
                                    <Info icon={<TvRoundedIcon />} title={'Episodios'}>
                                        <Episodes info={info} />
                                    </Info>
                                </FColG32>
                            </FRowG32>
                        </Content>
                        {info.title && (
                            <div>
                                <AnimeRecommendations
                                    animeName={info.title}
                                    title={'Similares a ' + info.title}
                                />
                            </div>
                        )}
                    </Wrapper>
                </Fade>
            </ContentContext.Provider>
        )
    },
)

UnhookedAnimePeek.displayName = 'UnhookedAnimePeek'

export const AnimePeek: React.FC<AnimePeekProps> = (props) => {
    const info = useAppSelector((d) => d.peek.info)
    return <UnhookedAnimePeek {...props} info={info} />
}

AnimePeek.displayName = 'AnimePeek'

export default AnimePeek
