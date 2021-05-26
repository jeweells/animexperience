import "@babel/polyfill";
import { ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { watch } from "../redux/reducers/watch";
import store, { useAppDispatch } from "../redux/store";
import RecentAnimes from "./components/RecentAnimes";
import { VideoPlayerModal } from "./components/VideoPlayerModal";
import "./index.less";
import { GlobalStyle } from "./styles/GlobalStyle";
import { muiTheme } from "./themes/mui";

const mainElement = document.createElement("div");
mainElement.setAttribute("id", "root");
document.body.appendChild(mainElement);

const App = () => {
    const dispatch = useAppDispatch();
    return (
        <React.Fragment>
            <GlobalStyle />
            <RecentAnimes />
            <VideoPlayerModal
                onExited={() => {
                    dispatch(watch.reset());
                }}
            />
        </React.Fragment>
    );
};

render(
    <Provider store={store}>
        <ThemeProvider theme={muiTheme}>
            <App />
        </ThemeProvider>
    </Provider>,
    mainElement
);
