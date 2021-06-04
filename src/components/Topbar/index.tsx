import React, { Fragment, useLayoutEffect, useState } from 'react'
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

export const useTopBarHeight = () => 56

export type TopbarProps = {}

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
        : 'Animexperience'
    return (
        <Fragment>
            <Wrapper style={{ height, display: isFullscreen ? 'none' : 'block' }}>
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
            <div style={{ paddingTop: height }}>{children}</div>
        </Fragment>
    )
})

Topbar.displayName = 'Topbar'

export default Topbar
