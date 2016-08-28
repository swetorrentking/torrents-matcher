var path = require("path");
var webpack = require('webpack')
var basePath = path.resolve(__dirname, "..");
module.exports = {
    entry: path.resolve(basePath, "src/app"),
    devtool: 'sourcemap',
    output: {
        path: path.resolve(basePath, "dist"),
        filename: 'bundle.js',
        // publicPath: "dist/",
    },
    resolve: {
        extensions: ['', '.ts', '.tsx', '.js', '.scss']
    },
    module: {
        /*preLoaders: [
         {
         test: /\.tsx?$/,
         loader: "source-map-loader"
         }
         ],*/
        loaders: [
            {test: /\.scss$/, loaders: ["style", "css", "sass"]
            },
            {test: /\.tsx?$/, loader: 'ts-loader'},
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/octet-stream'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=image/svg+xml'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require("../dist/package.json").version)
        })
    ],
    target: 'electron-renderer'
}