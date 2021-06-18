import React, { useEffect, useRef } from 'react'
import { Modal, ModalProps } from 'rsuite'
import styled from 'styled-components'
import { topview } from '../../../redux/reducers/topview'
import { useAppDispatch } from '../../../redux/store'
import { TopView } from '../../types'
import { useTopBarHeight } from '../Topbar'

const SModal = styled(Modal)<{ topBarHeight: number; contrast?: boolean }>`
    margin: 0;
    width: 100vw;
    overflow: hidden;
    --modal-height: calc(100vh - ${(props) => props.topBarHeight}px);
    height: var(--modal-height);
    top: ${(props) => props.topBarHeight}px;
    .rs-modal {
        &-dialog {
            margin: 0;
        }
        &-content {
            padding: 0;
            width: 100vw;
            height: var(--modal-height);
            overflow: hidden;
            border-radius: 0;
            ${(props) => (props.contrast ? 'background-color: #0f131a;' : '')}
        }
    }
`

export type FullModalProps = {
    contrast?: boolean
    show: string | undefined
    view: TopView
} & Omit<ModalProps, 'show'>

export const FullModal: React.FC<FullModalProps> = React.memo<FullModalProps>(
    ({ view, children, show, ...rest }) => {
        const topBarHeight = useTopBarHeight()
        const ref = useRef(null)
        const dispatch = useAppDispatch()

        // This tick will bring the modal top
        useEffect(() => {
            if (show) {
                // @ts-ignore
                const node = ref.current?.modalRef?.current?.modalNodeRef?.current
                if (node) {
                    console.debug('[HENTAI] SHOW CHANGED!', node)
                    document.body.appendChild(node)
                }
                dispatch(topview.push(view))
            } else {
                dispatch(topview.pop(view))
            }
        }, [show])
        return (
            <SModal
                ref={ref}
                topBarHeight={topBarHeight}
                full={true}
                show={!!show}
                {...rest}
            >
                {children}
            </SModal>
        )
    },
)

FullModal.displayName = 'FullModal'

export default FullModal
