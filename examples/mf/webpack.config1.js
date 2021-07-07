const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Mfp = require('webpack').container.ModuleFederationPlugin

module.exports = {
    entry: './src/main.js',
    output: {
        filename: './bundle.js',
        path: path.resolve(__dirname, 'dist1')
    },
    mode: 'development', 

    devServer: {
        port: 3001,
    },
    //  插件
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new Mfp({
            // 对外提供的打包后的⽂件名（引⼊时使⽤）
            filename: 'em.js',
            // 当前微应⽤名称
            name: 'em',
            // 暴露的应用内具体模块
            exposes: {
                // 名称： 代码路径
                './exposesModule': './src/exposesModule.js',
            }
        })

    ]
}