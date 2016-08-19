const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

var dir_app = path.resolve(__dirname, 'app');
var dir_html = path.resolve(__dirname, 'html');
var dir_artwork = path.resolve(__dirname, 'artwork');
var dir_build = path.resolve(__dirname, 'build');

module.exports = {
    entry: path.resolve(dir_app, 'app.js'),
    output: {
        path: dir_build,
        sourceMapFilename: "[file].map",
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /.js[x]?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                },
                exclude: /node_modules/
            },
            {test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
            {test: /\.css$/, loader: 'style-loader!css-loader'}
        ]
    },
    plugins: [
        // Simply copies the files over
        new CopyWebpackPlugin([
            {from: dir_html},
            {from: dir_artwork, to: 'artwork'}// to: output.path
        ]),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        })
    ],

    // Create Sourcemaps for the bundle
    debug: true,
    devtool: 'source-map'
};

