import React from 'react'
import { Suspended } from './hooks'

export type SuspenseProps = {
    fallback: React.ReactNode
}

export const Suspense: React.FC<SuspenseProps> = React.memo(({ fallback, children }) => {
    try {
        if (React.isValidElement(children)) {
            return children
        }
        return null
    } catch (e) {
        if (e instanceof Suspended) {
            if (React.isValidElement(fallback)) {
                return fallback
            }
            return null
        }
        throw e
    }
})

Suspense.displayName = 'Suspense'

export default Suspense
