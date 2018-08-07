const path = require('path')
const VueLoader = require('vue-loader')

let config = {
    entry: {
        main: './src/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'dist',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.ts', '.vue', '.json'],
        alias: {}
    },
    devServer: {
        noInfo: false,
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.scss$/,
                use: [
                  'vue-style-loader',
                  'css-loader',
                  'sass-loader'
                ]
            },
            {
                test: /\.woff(2)?(\?[a-z0-9]+)?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            }, {
                test: /\.(ttf|eot|svg)(\?[a-z0-9]+)?$/,
                loader: "file-loader"
            },
            {
                test: /\.(png|jpg|gif|mp4)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {}
                    }
                ]
            },
            {
                test: /\.(txt|vs|fs|frag|vert|glslx)$/,
                use: 'raw-loader'
            }
        ]
    },
    plugins: [
        new VueLoader.VueLoaderPlugin()
    ]
}

module.exports = config
