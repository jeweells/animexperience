const path = require('path')

const rootPath = path.resolve(__dirname, '..')

module.exports = {
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@components': path.resolve(__dirname, '../src/components/'),
            '@reducers': path.resolve(__dirname, '../redux/reducers/'),
            '@selectors': path.resolve(__dirname, '../src/selectors/'),
            '~': path.resolve(__dirname, '../'),
        }
    },
    devtool: 'source-map',
    entry: path.resolve(rootPath, 'electron', 'main.ts'),
    target: 'electron-main',
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|html)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.(js|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: ['@babel/plugin-proposal-class-properties'],
                    },
                },
            },
            {
                test: /\.node$/,
                use: 'node-loader',
            },
        ],
    },
    node: {
        __dirname: false,
    },
    output: {
        path: path.resolve(rootPath, 'dist'),
        filename: '[name].js',
    },
}
