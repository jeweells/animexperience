import {
  createContext,
  Fragment,
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  FC,
  memo,
  RefObject
} from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { styled } from '@mui/system'
import { useAppSelector } from '~/redux/utils'
import CloseButton from '../../atoms/CloseButton'
import SearchBar from '../SearchBar'
import fade from './fade.module.css'
import ShareAnimeEpisodeButton from '../ShareAnimeEpisodeButton'

const ipcRenderer = window.electron.ipcRenderer

const Wrapper = styled('div')`
  background: rgba(37, 40, 46, 0.26);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100000;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  display: flex;
  align-items: center;
`

const Container = styled('div')`
  padding: 0 0 0 24px;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  flex: 1;
`
const Buttons = styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
`

const Content = styled('div')`
  overflow-x: hidden;
  position: relative;
`

export const useTopBarHeight = () => 56

export type TopbarProps = PropsWithChildren

export const ContentContext = createContext<RefObject<HTMLDivElement> | null>(null)
export const useContentRef = () => useContext(ContentContext)

const closeApp = () => {
  return ipcRenderer.invoke('closeApp')
}

export const Topbar: FC<TopbarProps> = memo(({ children }) => {
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
  const title = watching ? `${watching.name} - Episodio ${watching.episode}` : 'ANIMEXPERIENCE'
  const contentRef = useRef<HTMLDivElement>(null)
  return (
    <Fragment>
      {!isFullscreen && (
        <Wrapper
          style={{
            height
          }}
        >
          <SwitchTransition>
            <CSSTransition
              key={title}
              addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
              classNames={{ ...fade }}
            >
              <Container>
                <div>{title}</div>
                {!watching && <SearchBar style={{ marginRight: 8 }} />}
                {watching && (
                  <ShareAnimeEpisodeButton
                    style={{
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      WebkitAppRegion: 'no-drag',
                      WebkitUserSelect: 'all'
                    }}
                  />
                )}
              </Container>
            </CSSTransition>
          </SwitchTransition>
          <Buttons>
            <CloseButton
              style={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                WebkitAppRegion: 'no-drag',
                WebkitUserSelect: 'all',
                borderRadius: 0,
                height: '100%',
                width: 48,

                background: 'rgb(0,0,0,0)'
              }}
              onClick={closeApp}
            />
          </Buttons>
        </Wrapper>
      )}
      <Content
        ref={contentRef}
        style={{
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          overflowY: 'overlay',
          marginTop: height,
          height: `calc(100vh - ${height}px)`
        }}
      >
        <ContentContext.Provider value={contentRef}>{children}</ContentContext.Provider>
      </Content>
    </Fragment>
  )
})

Topbar.displayName = 'Topbar'

export default Topbar
