import { makeStyles } from '@material-ui/core'
import Portal from '@material-ui/core/Portal'
import { Theme as DefaultTheme } from '@material-ui/core/styles/createMuiTheme'
import React from 'react'
import { Transition } from 'react-transition-group'
import { useSizes } from '../AnimesCarousel/hooks'
import { useContentRef } from '../Topbar'
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
    children: (className: string) => React.ReactNode
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
                return children(classes.item) ?? null
            }}
        </Transition>
    )
}

export type CardPopoverProps = {
    open: boolean
    anchorEl?: React.RefObject<HTMLElement>
    onClose?(): void
}

export const CardPopover: React.FC<CardPopoverProps> = React.memo(
    ({ open, children, anchorEl, onClose }) => {
        const floatingContainerRef = React.useRef<HTMLDivElement>(null)
        const [position, setPosition] = React.useState<DOMRect | null>(null)
        const { navigationWidth } = useSizes()
        const containerRef = useContentRef()
        const origin = React.useMemo(() => {
            if (position === null) return null
            const { top, left, right, bottom } = position
            let originY = 'top'
            let originX = 'center'
            if (top <= 0) {
                originY = 'top'
            }
            if (bottom <= 0) {
                originY = 'bottom'
            }
            if (left - navigationWidth - 1 <= 0) {
                originX = 'left'
            }
            if (right - navigationWidth - 1 <= 0) {
                originX = 'right'
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
                                console.debug(
                                    'CLOSING SINCE NOT HOVERING',
                                    anchorEl?.current,
                                    floatingContainerRef?.current,
                                )
                                onClose?.()
                            }
                        }
                    }
                }

                if (anchorEl?.current) {
                    const cb = (cb: DOMRect) => {
                        const cRefRect = containerRef?.current?.getBoundingClientRect()
                        if (cRefRect) {
                            const rect = cb.toJSON()
                            const scrollTop = containerRef?.current?.scrollTop ?? 0
                            // Make it relative to its container
                            rect.left -= cRefRect.left
                            rect.top -= cRefRect.top - scrollTop
                            rect.right -= cRefRect.left
                            rect.bottom -= cRefRect.top - scrollTop
                            rect.x -= cRefRect.x
                            rect.y -= cRefRect.y - scrollTop
                            const width = window.innerWidth
                            const height = window.innerHeight
                            setPosition({
                                ...rect,
                                right: width - rect.right,
                                bottom: height - rect.bottom,
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
        console.debug('CARD POPOVER UPDATE', open, position, containerRef?.current)
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
                                    top: position.top,
                                    left: position.left,
                                    zIndex: 10000,
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
