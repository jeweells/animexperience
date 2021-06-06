import React, {
    createContext,
    Fragment,
    useContext,
    useLayoutEffect,
    useRef,
    useState,
} from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import styled from 'styled-components'
import { useAppSelector } from '../../../redux/store'
import fade from './fade.module.less'
const Wrapper = styled.div`
    background: #25282e;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100000;
    -webkit-user-select: none;
    -webkit-app-region: drag;
`

const Container = styled.div`
    padding: 16px 24px;
    font-size: 1rem;
    font-weight: 700;
`

const Content = styled.div`
    overflow-x: hidden;
    position: relative;
`

export const useTopBarHeight = () => 56

export type TopbarProps = {}

export const ContentContext = createContext<React.RefObject<HTMLDivElement> | null>(null)
export const useContentRef = () => useContext(ContentContext)

export const Topbar: React.FC<TopbarProps> = React.memo(({ children }) => {
    const watching = useAppSelector((d) => d.watch.watching)
    const [isFullscreen, setIsFullScreen] = useState(false)
    useLayoutEffect(() => {
        const handle = () => {
            setIsFullScreen(!!document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', handle)
        return () => {
            document.removeEventListener('fullscreenchange', handle)
        }
    }, [])
    const height = useTopBarHeight()
    const title = watching
        ? `${watching.name} - Episodio ${watching.episode}`
        : 'ANIMEXPERIENCE'
    const contentRef = useRef<HTMLDivElement>(null)
    return (
        <Fragment>
            {!isFullscreen && (
                <Wrapper
                    style={{
                        height,
                    }}
                >
                    <Container>
                        <SwitchTransition>
                            <CSSTransition
                                key={title}
                                addEndListener={(node, done) =>
                                    node.addEventListener('transitionend', done, false)
                                }
                                classNames={{ ...fade }}
                            >
                                <div>{title}</div>
                            </CSSTransition>
                        </SwitchTransition>
                    </Container>
                </Wrapper>
            )}
            <Content
                ref={contentRef}
                style={{
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    overflowY: 'overlay',
                    marginTop: height,
                    height: `calc(100vh - ${height}px)`,
                }}
            >
                <ContentContext.Provider value={contentRef}>
                    {children}
                </ContentContext.Provider>
            </Content>
        </Fragment>
    )
})

Topbar.displayName = 'Topbar'

export default Topbar
