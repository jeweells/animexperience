import { Fade } from "@material-ui/core";
import React from "react";
import { Button } from "rsuite";
import { watch } from "../../../redux/reducers/watch";
import { useAppDispatch, useAppSelector } from "../../../redux/store";

export type NextEpisodeButtonProps = {}

export const NextEpisodeButton: React.FC<NextEpisodeButtonProps> = React.memo(({}) => {
    const timeout = useAppSelector(d => d.watch.nextEpisodeTimeout);
    const dispatch = useAppDispatch();
    const showNextButton = useAppSelector(d => d.watch.showNextEpisodeButton);
    const handleNext = () => {
        dispatch(watch.setNextEpisodeButton(false));
        dispatch(watch.nextEpisode());
    };
    return (
        <Fade in={showNextButton} timeout={400}>
            <div style={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 2147483647,
            }}
            >
                <Button
                    style={{
                        position: "relative",
                    }}
                    onClick={() => {
                        handleNext();
                    }}
                >
                    <span style={{ position: "relative", zIndex: 2 }}>
                        Siguiente episodio
                    </span>
                    <div
                        style={{
                            position: "absolute",
                            zIndex: 1,
                            top: 0,
                            left: 0,
                            bottom: 0,
                            backgroundColor: "rgba(255,255,255,0.1)",
                            width: timeout !== -1 && showNextButton ? "100%" : "0",
                            transition: timeout === -1 ? "none" : `all ${timeout}s`,
                        }}
                    />
                </Button>
            </div>
        </Fade>
    );
});

NextEpisodeButton.displayName = "NextEpisodeButton";

export default NextEpisodeButton;
