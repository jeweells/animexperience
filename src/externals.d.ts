declare module '*.less' {
    const resource: { [key: string]: string }
    export = resource
}
declare module '*.css' {
    const resource: { [key: string]: string }
    export = resource
}
declare module '*.ttf' {
    const resource: string
    export = resource
}
