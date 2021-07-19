import json from 'rollup-plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import html from '@rollup/plugin-html'
import serve from 'rollup-plugin-serve'
console.log(process.env.NODE_ENV)
export default {
    input: 'src/main.js',
    output: {
        // file: 'dist/bundle.js',
        format: 'umd',
        dir: 'dist'
    },
    plugins:[
        json(),
        resolve(),
        commonjs(),
        // html(),
        serve()
    ]
}