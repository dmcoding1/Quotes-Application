const path = require('path');

module.exports = {
    entry: './client/src/index.js',
    output: {
        path: path.resolve(__dirname, 'client/dist'),
        filename: 'bundle.js'
    },
    mode: "development",
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'eslint-loader',
                options: require("./eslint.config.js").options
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}