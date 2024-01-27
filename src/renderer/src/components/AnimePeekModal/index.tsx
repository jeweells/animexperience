import * as React from 'react'
import { peek } from '@reducers'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import AnimePeekPlaceholder from '../../placeholders/AnimePeekPlaceholder'
import { TopView } from '@shared/types'
import AnimePeek from '../AnimePeek'
import FullModal, { FullModalProps } from '../FullModal'

export type AnimePeekModalProps = Omit<FullModalProps, 'show' | 'children' | 'view'>

export const AnimePeekModal: React.FC<AnimePeekModalProps> = React.memo(({ ...rest }) => {
  const peeking = useAppSelector((d) => d.peek.peeking)
  const dispatch = useAppDispatch()
  const status = useAppSelector((d) => d.peek.status.info)

  const handleClose = () => {
    dispatch(peek.setPeeking(undefined))
  }

  return (
    <FullModal view={TopView.PEEK} show={peeking} contrast={true} {...rest}>
      {status === 'succeeded' ? (
        <AnimePeek onClose={handleClose} />
      ) : (
        <AnimePeekPlaceholder onClose={handleClose} />
      )}
    </FullModal>
  )
})

AnimePeekModal.displayName = 'AnimePeekModal'

export default AnimePeekModal
