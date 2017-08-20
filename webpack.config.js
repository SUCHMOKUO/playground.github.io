const webpack = require('webpack');

module.exports = {
    entry: './js/playground.js',
    output: {
        path: `${__dirname}/dist`,
        filename: 'bundle.js',
        publicPath: '/dist'
    },
    module: {
        rules: [
            //sass config
            { test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"] },
            //babel config
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({}),
    ]
}