const path = require('path')

const rootPath = path.resolve(__dirname, '..')

module.exports = {
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
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
