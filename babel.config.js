module.exports = {
    plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-proposal-class-properties',
        ['@babel/plugin-proposal-private-methods', { loose: false }],
        ['@babel/plugin-proposal-private-property-in-object', { loose: false }],
    ],
    presets: [
        '@babel/preset-react',
        '@babel/preset-typescript',
        ['rsuite', { style: true, theme: 'dark' }],
        [
            'babel-preset-gatsby',
            {
                targets: {
                    browsers: ['>0.25%', 'not dead'],
                },
            },
        ],
    ],
}
