const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Mfp = require('webpack').container.ModuleFederationPlugin

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: './bundle.js',
        path: path.resolve(__dirname, 'dist2')
    },
    devServer: {
        port: 3002,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new Mfp({
            // 导⼊模块
            remotes: {
                // 导⼊后给模块起个别名：“微应⽤名称@地址/导出的⽂件名”
                appone: 'em@http://localhost:3001/em.js'
            }
        })
    ]
}