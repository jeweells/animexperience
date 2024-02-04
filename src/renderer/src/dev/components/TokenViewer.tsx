import { Token, useTokens } from '../hooks/useTokens'
import { useEffect, useRef } from 'react'
import 'luna-object-viewer/luna-object-viewer.css'
import LunaObjectViewer from 'luna-object-viewer'
import { Box } from '@mui/material'

const BaseTokenViewer = ({ token }: { token: Token }) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const objViewer = new LunaObjectViewer(ref.current, {
      unenumerable: false,
      accessGetter: true
    })
    objViewer.set(token)
    objViewer.setOption('theme', 'dark')
    return () => objViewer.destroy()
  }, [token])

  return (
    <Box bgcolor={'#3a3939'} p={1} borderRadius={1} width={'100%'} height={400} overflow={'auto'}>
      <div ref={ref}></div>
    </Box>
  )
}

export const TokenViewer = ({ index }: { index: number }) => {
  const token = useTokens((state) => state.tokens[index])
  return <BaseTokenViewer token={token} />
}
