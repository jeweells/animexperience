import Dialog, { DialogProps } from '@mui/material/Dialog'
import Fade from '@mui/material/Fade'
import React, { useLayoutEffect } from 'react'
import styled from 'styled-components'
import { topView } from '@reducers'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import { TopView } from '../../types'
import { useTopBarHeight } from '../Topbar'

type SModalProps = { topBarHeight: number; contrast?: boolean } & DialogProps

const SModal = styled(({ contrast, topBarHeight, ...props }: SModalProps) => {
    return <Dialog {...props} />
})<SModalProps>`
    margin: 0;
    width: 100vw;
    overflow: hidden;
    --modal-height: calc(100vh - ${(props) => props.topBarHeight}px);
    height: var(--modal-height);
    background-color: transparent;
    .MuiDialog-container {
        background-color: #0f131a;
    }
    top: ${(props) => props.topBarHeight}px !important;
    .MuiPaper-root {
        background-image: unset;
        background-color: ${(props) => (props.contrast ? '#0f131a' : 'unset')};
    }
`

export type FullModalProps = {
    contrast?: boolean
    show: string | undefined
    view: TopView
} & Omit<DialogProps, 'open'>

export const FullModal: React.FC<FullModalProps> = React.memo<FullModalProps>(
    ({ view, children, show, ...rest }) => {
        const topBarHeight = useTopBarHeight()
        const currentTopview = useAppSelector((d) => d.topView.views[0])
        const dispatch = useAppDispatch()

        useLayoutEffect(() => {
            if (show) {
                dispatch(topView.push(view))
            } else {
                dispatch(topView.pop(view))
            }
        }, [show])
        return (
            <SModal
                TransitionComponent={Fade}
                fullScreen={true}
                disableEnforceFocus={true}
                topBarHeight={topBarHeight}
                open={!!currentTopview && currentTopview === view}
                {...rest}
                TransitionProps={{
                    appear: true,
                    mountOnEnter: true,
                    unmountOnExit: true,
                    timeout: 300,
                    ...rest.TransitionProps,
                    onExited(...args) {
                        // When show is valid the view is pushed into the topViews and the modal should not be
                        // considered as closed
                        // TODO: avoid calling the callbacks: onClose, onExiting
                        if (!show) {
                            rest.TransitionProps?.onExited?.(...args)
                        }
                    },
                }}
            >
                {children}
            </SModal>
        )
    },
)

FullModal.displayName = 'FullModal'

export default FullModal
