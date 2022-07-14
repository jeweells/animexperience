import Dialog, { DialogProps } from '@mui/material/Dialog'
import Fade from '@mui/material/Fade'
import React, { useLayoutEffect } from 'react'
import styled from 'styled-components'
import { topview } from '../../../redux/reducers/topview'
import { useAppDispatch, useAppSelector } from '../../../redux/store'
import { TopView } from '../../types'
import { useTopBarHeight } from '../Topbar'

const SModal = styled(Dialog)<{ topBarHeight: number; contrast?: boolean }>`
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
        const currentTopview = useAppSelector((d) => d.topview.views[0])
        const dispatch = useAppDispatch()

        useLayoutEffect(() => {
            if (show) {
                dispatch(topview.push(view))
            } else {
                dispatch(topview.pop(view))
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
