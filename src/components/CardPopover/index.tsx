import { makeStyles } from '@mui/styles'
import { DefaultTheme } from '@mui/styles/defaultTheme'
import React, { PropsWithChildren, ReactNode } from 'react'
import { Transition } from 'react-transition-group'
import { useSizes } from '../AnimesCarousel/hooks'
import { useContentRef } from '../Topbar'
import Portal from '@mui/material/Portal'

const useStyles = makeStyles<
    DefaultTheme,
    {
        duration: number
    }
>({
    item: {
        transform: 'scale(1)',
        transition: (props) => `all ${props.duration}ms`,
        '&:hover': {
            transform: 'scale(1.3)',
        },
    },
})
type ScaleOnHoverProps = {
    in: boolean
    children?(className: string): ReactNode
    onExited?(): void
    onEnter?(): void
}

const ScaleOnHover: React.VFC<ScaleOnHoverProps> = ({
    in: inProp,
    children,
    onExited,
    onEnter,
}) => {
    const duration = 300
    const classes = useStyles({
        duration,
    })
    return (
        <Transition
            in={inProp}
            timeout={duration}
            mountOnEnter={true}
            unmountOnExit={true}
            onEnter={onEnter}
            onExited={onExited}
            appear={true}
        >
            {() => {
                return children?.(classes.item) ?? null
            }}
        </Transition>
    )
}

export type CardPopoverProps = PropsWithChildren<{
    open: boolean
    anchorEl?: React.RefObject<HTMLElement>
    onClose?(): void
}>

type Position = {
    top: number
    bottom: number
    left: number
    right: number
}

type MixedPosition = {
    windowRelative: Position
    relative: Position
    containerSize: { width: number; height: number }
}

export const CardPopover: React.FC<CardPopoverProps> = React.memo(
    ({ open, children, anchorEl, onClose }) => {
        const floatingContainerRef = React.useRef<HTMLDivElement>(null)
        const [position, setPosition] = React.useState<MixedPosition | null>(null)
        const { navigationWidth } = useSizes()
        const containerRef = useContentRef()
        const origin = React.useMemo(() => {
            if (position === null) return null
            const { left, right } = position.windowRelative
            const { top, bottom } = position.relative
            let originY: string
            let originX: string
            const wWidth = window.innerWidth
            const threshold = 80
            if (top <= threshold) {
                originY = 'top'
            } else if (position.containerSize.height - bottom <= threshold) {
                originY = 'bottom'
            } else {
                originY = 'center'
            }
            if (left - navigationWidth <= threshold) {
                originX = 'left'
            } else if (wWidth - right - navigationWidth <= threshold) {
                originX = 'right'
            } else {
                originX = 'center'
            }
            return `${originX} ${originY}`
        }, [position, navigationWidth])
        React.useLayoutEffect(() => {
            if (open) {
                const shouldCloseHandle = () => {
                    if (floatingContainerRef.current) {
                        if (!floatingContainerRef.current.matches(':hover')) {
                            // Some cases the popover takes so long to render that
                            // the anchor element is the one that has hover
                            if (!(anchorEl?.current?.matches(':hover') ?? false)) {
                                onClose?.()
                            }
                        }
                    }
                }

                if (anchorEl?.current) {
                    const cb = (cb: DOMRect) => {
                        const containerRect =
                            containerRef?.current?.getBoundingClientRect()
                        if (containerRect) {
                            const ancElRect = cb.toJSON()
                            const scrollTop = containerRef?.current?.scrollTop ?? 0
                            setPosition({
                                // Make it relative to its container
                                relative: {
                                    left: ancElRect.left - containerRect.left,
                                    top: ancElRect.top - containerRect.top + scrollTop,
                                    right: ancElRect.left - containerRect.left,
                                    bottom:
                                        ancElRect.bottom - containerRect.top + scrollTop,
                                },
                                windowRelative: {
                                    left: ancElRect.left,
                                    top: ancElRect.top,
                                    right: ancElRect.right,
                                    bottom: ancElRect.bottom,
                                },
                                containerSize: {
                                    width: containerRect.width,
                                    height: containerRef?.current?.scrollHeight ?? 0,
                                },
                            })
                        }
                    }
                    if (anchorEl.current) {
                        cb(anchorEl.current.getBoundingClientRect())
                    }
                }

                document.addEventListener('mousemove', shouldCloseHandle)
                return () => {
                    document.removeEventListener('mousemove', shouldCloseHandle)
                }
            }
        }, [open])
        return (
            <Portal container={containerRef?.current}>
                <ScaleOnHover
                    in={open}
                    onExited={() => {
                        if (!open) {
                            setPosition(null)
                            onClose?.()
                        }
                    }}
                >
                    {(className) =>
                        position !== null &&
                        origin !== null && (
                            <div
                                ref={floatingContainerRef}
                                style={{
                                    position: 'absolute',
                                    pointerEvents: 'all',
                                    top: position.relative.top,
                                    left: position.relative.left,
                                    zIndex: 100,
                                }}
                            >
                                <div
                                    className={className}
                                    style={{
                                        transformOrigin: origin,
                                    }}
                                >
                                    {children}
                                </div>
                            </div>
                        )
                    }
                </ScaleOnHover>
            </Portal>
        )
    },
)

CardPopover.displayName = 'CardPopover'

export default CardPopover
