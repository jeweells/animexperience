import { FC, memo, PropsWithChildren } from 'react'
import { useFadeInStyles } from '~/src/globalMakeStyles/fadeIn'
import { styled } from '@mui/system'
import { FCol } from '~/src/atoms/Layout'

type Props = PropsWithChildren<{
  html?: string
  loading?: boolean
  updateRef?(r: HTMLDivElement | null): void
}>

const Wrapper = styled(FCol)`
  flex: 1;
  width: 100%;
  overflow: hidden;
  position: relative;
  transition: opacity 300ms ease-in-out;
  will-change: opacity;
`

export const Iframe: FC<Props> = memo(({ html, updateRef, loading, children }) => {
  const { fadeIn } = useFadeInStyles()
  if (!html) return null
  return (
    <Wrapper className={fadeIn} style={{ opacity: loading ? 0 : 1 }} ref={updateRef}>
      <div
        style={{ flex: 1, width: '100%', overflow: 'hidden' }}
        ref={updateRef}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {children}
    </Wrapper>
  )
})

Iframe.displayName = 'Iframe'
