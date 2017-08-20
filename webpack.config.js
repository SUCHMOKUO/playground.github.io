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
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf|ico)\??.*$/,
                loader: "url-loader?limit=1000000"
            },
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({}),
    ]
}