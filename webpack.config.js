const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: './client/src/index.js',
    output: {
        path: path.resolve(__dirname, 'client/dist'),
        filename: 'bundle.js'
    },
    mode: "production",
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components|server)/,
                loader: 'eslint-loader',
                options: require("./eslint.config.js").options
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components|server)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }, 
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }
            },
            {

            },
            {
                test: /\.(png|svg|jpg|gif|ico)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {from: "./client/src/images/", to: "images/"},
                {from: "./client/src/font/", to: "font/"},
                {from: "./client/src/manifest.json", to: "manifest.json"}
            ]
        }),
        new HtmlWebpackPlugin({
            template: './client/src/index.html',
            filename: './index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new WorkboxWebpackPlugin.GenerateSW({
            swDest: 'sw.js',
            clientsClaim: true,
            skipWaiting: true
        }),
        new Dotenv()
    ]
}