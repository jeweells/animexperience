import React from 'react'
import { useAppSelector } from '../../../redux/store'
import { TopView } from '../../types'
import AnimePeek from '../AnimePeek'
import FullModal, { FullModalProps } from '../FullModal'

export type AnimePeekModalProps = {} & Omit<FullModalProps, 'show'>

export const AnimePeekModal: React.FC<AnimePeekModalProps> = React.memo(({ ...rest }) => {
    const peeking = useAppSelector((d) => d.peek.peeking)
    const status = useAppSelector((d) => d.peek.status.info)
    return (
        <FullModal
            view={TopView.PEEK}
            show={peeking}
            full={false}
            contrast={true}
            {...rest}
        >
            {status === 'succeeded' ? <AnimePeek /> : <div>Loading...</div>}
        </FullModal>
    )
})

AnimePeekModal.displayName = 'AnimePeekModal'

export default AnimePeekModal
