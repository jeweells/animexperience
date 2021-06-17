import React from 'react'
import { Modal, ModalProps } from 'rsuite'
import styled from 'styled-components'
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

export type FullModalProps = { contrast?: boolean } & ModalProps

export const FullModal: React.FC<FullModalProps> = React.memo<FullModalProps>(
    ({ children, ...rest }) => {
        const topBarHeight = useTopBarHeight()

        return (
            <SModal topBarHeight={topBarHeight} full={true} {...rest}>
                {children}
            </SModal>
        )
    },
)

FullModal.displayName = 'FullModal'

export default FullModal
