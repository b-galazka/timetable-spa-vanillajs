const path = require('path');
const webpack = require('webpack');

module.exports = {

    entry: [
        'babel-polyfill',
        'element-closest',
        path.resolve(__dirname, 'src/index.js')
    ],

    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'app.js',
        publicPath: '/dist/'
    },

    module: {
        loaders: [
            {
                test: /\.js?$/,
                include: path.resolve(__dirname, 'src'),
                loader: 'babel-loader'
            },

            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],

    resolve: {
        extensions: ['.js', '.json']
    },

    devServer: {
        contentBase: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'dist')],
        inline: true,
        hot: true,
        port: 3000,
        historyApiFallback: true,
        publicPath: '/js/'
    }
};