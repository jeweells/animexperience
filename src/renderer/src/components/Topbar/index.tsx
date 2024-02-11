import {
  createContext,
  Fragment,
  PropsWithChildren,
  useContext,
  useRef,
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
import { useIsFullscreen } from '~/src/hooks/useIsFullscreen'
import { UpdateButton } from '@components/UpdateButton'

const ipcRenderer = window.electron.ipcRenderer

const Wrapper = styled('div')`
  background: rgb(21, 24, 31);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100000;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  display: flex;
  align-items: center;
  transition: height 300ms ease-in-out;
  will-change: height, opacity;
  contain: paint;
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
  margin-left: 8px;
`

const Content = styled('div')`
  overflow-x: hidden;
  position: relative;
`

export const useTopBarHeight = () => {
  const isFullscreen = useIsFullscreen()
  if (isFullscreen) return 0
  return 56
}

export type TopbarProps = PropsWithChildren

export const ContentContext = createContext<RefObject<HTMLDivElement> | null>(null)
export const useContentRef = () => useContext(ContentContext)

const closeApp = () => {
  return ipcRenderer.invoke('closeApp')
}

export const Topbar: FC<TopbarProps> = memo(({ children }) => {
  const watching = useAppSelector((d) => d.watch.watching)
  const height = useTopBarHeight()
  const title = watching ? `${watching.name} - Episodio ${watching.episode}` : 'ANIMEXPERIENCE'
  const contentRef = useRef<HTMLDivElement>(null)
  return (
    <Fragment>
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
              {!watching && <SearchBar />}
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
          <UpdateButton />
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
