import * as React from 'react'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import WatchInvokedLink from '../WatchInvokedLink'
import FullModal, { FullModalProps } from '../FullModal'
import { TopView } from '@shared/types'
import { invokedLink } from '@reducers/invokedLink'

export type WatchInvokedLinkModalProps = Omit<FullModalProps, 'show' | 'children' | 'view'>

export const WatchInvokedLinkModal: React.FC<WatchInvokedLinkModalProps> =
  React.memo<WatchInvokedLinkModalProps>(({ ...rest }) => {
    const open = useAppSelector((d) => d.invokedLink.open.watch)
    const dispatch = useAppDispatch()

    const close = () => {
      dispatch(invokedLink.hide('watch'))
    }

    return (
      <FullModal
        view={TopView.INVOKED_LINK}
        show={open}
        TransitionProps={{
          appear: true,
          mountOnEnter: true,
          unmountOnExit: true,
          timeout: 300,
          ...rest.TransitionProps,
          onExited(...args) {
            if (!open) {
              rest.TransitionProps?.onExited?.(...args)
            }
          }
        }}
        {...rest}
        onPopRequested={close}
      >
        <WatchInvokedLink onClose={close} />
      </FullModal>
    )
  })

WatchInvokedLinkModal.displayName = 'WatchInvokedLinkModal'

export default WatchInvokedLinkModal
