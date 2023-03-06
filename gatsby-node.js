// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')

exports.onCreateWebpackConfig = ({ actions, getConfig }) => {
    const config = getConfig()
    config.target = 'electron-renderer'
    config.resolve.alias = {
        ...config.resolve.alias,
        '@components': path.resolve(__dirname, './src/components/'),
        '@reducers': path.resolve(__dirname, './redux/reducers/'),
        '@selectors': path.resolve(__dirname, './src/selectors/'),
        '~': path.resolve(__dirname, './'),
    }
    actions.replaceWebpackConfig(config)
}

const targetDir = path.join('dist', 'renderer')

exports.onPreInit = () => {
    if (process.argv[2] === 'build') {
        fs.rmdirSync(path.join(__dirname, targetDir), { recursive: true })
    }
}

exports.onPostBuild = () => {
    fs.renameSync(path.join(__dirname, 'public'), path.join(__dirname, targetDir))
}
