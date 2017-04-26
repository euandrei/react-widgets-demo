var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


var BUILD_DIR = path.resolve(__dirname, './build');
var APP_DIR = path.resolve(__dirname, './front-end-app');
var STYLE_DIR = path.resolve(__dirname, './less');


var config = {
    entry:{
        app : APP_DIR + '/index.jsx',
        styles: STYLE_DIR + '/main.less'
    },

    module : {
        exports : [
            {
                entry: ['babel-polyfill', APP_DIR]
            }
        ],
        loaders : [
            {
                test : /\.jsx?/,
                include : APP_DIR,
                loader : 'babel',
            },

            {
                test: /\.less$/,
                include: STYLE_DIR,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            }

        ]
    },
    plugins: [
        new ExtractTextPlugin("[name].css")
    ],
    output: {
        path: BUILD_DIR,
        filename: "[name].js"

    }
};

module.exports = config;

