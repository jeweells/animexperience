import "@babel/polyfill";
import { ElectronBlocker, fullLists, Request } from "@cliqz/adblocker-electron";
import { app, BrowserWindow, session } from "electron";
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-devtools-installer";
import { promises as fs } from "fs";
import fetch from "node-fetch";
import * as path from "path";
import * as url from "url";
import setupSdk from "./sdk";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("@electron/remote/main").initialize();


app.commandLine.appendSwitch("disable-site-isolation-trials");
let mainWindow: Electron.BrowserWindow | null;


async function createWindow () {
    mainWindow = new BrowserWindow({
        containerWidth: 1100,
        height: 700,
        backgroundColor: "#191622",
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });
    const publicPath = process.env.NODE_ENV === "development"
        ? "http://localhost:4000"
        : path.join(__dirname, "renderer");
    mainWindow.webContents.setWindowOpenHandler(() => {
        return {
            action: "deny"
        };
    });

    mainWindow.webContents.on("media-paused", () => {
        console.debug("Media paused!");
    });
    mainWindow.webContents.on("media-started-playing", () => {
        console.debug("Media started playing!");
    });
    // Referrer needed to display some players in JKAnime.net
    session.defaultSession.webRequest.onBeforeSendHeaders({
        urls: ["https://jkanime.net/*"],
    }, (details, callback) => {
        const url = new URL(details.url);
        details.requestHeaders.Origin = url.origin;
        if (!details.url.includes(publicPath) &&
            details.requestHeaders.Referer &&
            details.requestHeaders.Referer.includes(publicPath)) {
            details.requestHeaders.Referer = details.url;
            console.debug("ADDED REFERER FOR", details.url);
        }
        // eslint-disable-next-line standard/no-callback-literal
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });
    const blocker = await ElectronBlocker.fromLists(
        fetch,
        fullLists,
        {
            enableCompression: true
        },
        {
            path: "engine.bin",
            read: fs.readFile,
            write: fs.writeFile
        }
    );

    blocker.enableBlockingInSession(session.defaultSession);

    blocker.on("request-blocked", (request: Request) => {
        console.debug("blocked", request.tabId, request.url);
    });

    blocker.on("request-redirected", (request: Request) => {
        console.debug("redirected", request.tabId, request.url);
    });

    blocker.on("request-whitelisted", (request: Request) => {
        console.debug("whitelisted", request.tabId, request.url);
    });

    blocker.on("csp-injected", (request: Request) => {
        console.debug("csp", request.url);
    });

    blocker.on("script-injected", (script: string, url: string) => {
        console.debug("script", script.length, url);
    });

    blocker.on("style-injected", (style: string, url: string) => {
        console.debug("style", style.length, url);
    });

    if (process.env.NODE_ENV === "development") {
        const window = mainWindow;
        mainWindow.webContents.on("did-frame-finish-load", () => {
            window.webContents.openDevTools({
                mode: "detach"
            });
        });

        mainWindow.loadURL(publicPath);
    } else {
        mainWindow.loadURL(
            url.format({
                pathname: path.join(publicPath, "index.html"),
                protocol: "file:",
                slashes: true
            })
        );
    }

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

app.on("ready", createWindow)
    .whenReady()
    .then(() => {
        if (process.env.NODE_ENV === "development") {
            installExtension(REACT_DEVELOPER_TOOLS)
                .then((name) => console.debug(`Added Extension:  ${name}`))
                .catch((err) => console.debug("An error occurred: ", err));
            installExtension(REDUX_DEVTOOLS)
                .then((name) => console.debug(`Added Extension:  ${name}`))
                .catch((err) => console.debug("An error occurred: ", err));
        }
    });

app.allowRendererProcessReuse = true;
setupSdk();
