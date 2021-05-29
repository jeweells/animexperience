import { makeStyles } from "@material-ui/core";
import Portal from "@material-ui/core/Portal";
import { Theme as DefaultTheme } from "@material-ui/core/styles/createMuiTheme";
import React from "react";
import { Transition } from "react-transition-group";
import { useSizes } from "../AnimesCarousel/hooks";


const useStyles = makeStyles<DefaultTheme, {
    duration: number;
}>((
    {
        item: {
            "transform": "scale(1)",
            "transition": props => `all ${props.duration}ms`,
            "&:hover": {
                transform: "scale(1.1)",
            },
        },
    }
));
type ScaleOnHoverProps = {
    in: boolean;
    children: (className: string) => React.ReactNode;
    onExited? (): void;
}

const ScaleOnHover: React.VFC<ScaleOnHoverProps> = ({
    in: inProp,
    children,
    onExited,
}) => {
    const duration = 300;
    const classes = useStyles({
        duration,
    });
    return (
        <Transition
            in={inProp}
            timeout={duration}
            mountOnEnter={true}
            unmountOnExit={true}
            onExited={onExited}
            appear={true}
        >
            {() => {
                return children(classes.item) ?? null;
            }}
        </Transition>
    );
};


export type CardPopoverProps = {
    open: boolean;
    anchorEl?: React.RefObject<HTMLElement>;
    onClose? (): void;
}


export const CardPopover: React.FC<CardPopoverProps> = React.memo(({
    open,
    children,
    anchorEl,
    onClose,
}) => {
    const floatingContainerRef = React.useRef<HTMLDivElement>(null);
    const [position, setPosition] = React.useState<DOMRect | null>(null);
    const { navigationWidth } = useSizes();
    React.useLayoutEffect(() => {
        if (anchorEl?.current && open) {
            console.debug("Open is true");
            const rect = anchorEl.current.getBoundingClientRect().toJSON();
            const width = window.innerWidth;
            const height = window.innerHeight;
            setPosition({
                ...rect,
                right: width - rect.right,
                bottom: height - rect.bottom,
            });
        }
    }, [anchorEl, open, navigationWidth]);
    const origin = React.useMemo(() => {
        if (position === null) return null;
        const {
            top,
            left,
            right,
            bottom,
        } = position;
        let originY = "top";
        let originX = "center";
        if (top <= 0) {
            originY = "top";
        }
        if (bottom <= 0) {
            originY = "bottom";
        }
        if (left - navigationWidth - 1 <= 0) {
            originX = "left";
        }
        if (right - navigationWidth - 1 <= 0) {
            originX = "right";
        }
        return `${originX} ${originY}`;
    }, [position, navigationWidth]);
    React.useLayoutEffect(() => {
        if (open && position !== null) {
            const shouldCloseHandle = () => {
                if (!floatingContainerRef.current?.matches(":hover")) {
                    onClose?.();
                }
            };
            document.addEventListener("mousemove", shouldCloseHandle);
            return () => {
                document.removeEventListener("mousemove", shouldCloseHandle);
            };
        }
    }, [open, position !== null]);
    return (
        <Portal>
            <ScaleOnHover
                in={open}
                onExited={() => {
                    setPosition(null);
                }}
            >
                {className => (
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            top: 0,
                            overflow: "hidden",
                            pointerEvents: "none",
                        }}
                    >
                        {position !== null && origin !== null && (
                            <div
                                ref={floatingContainerRef}
                                style={{
                                    position: "absolute",
                                    pointerEvents: "all",
                                    top: position.top,
                                    left: position.left,
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
                        )}
                    </div>
                )}
            </ScaleOnHover>
        </Portal>
    );
});

CardPopover.displayName = "CardPopover";

export default CardPopover;
