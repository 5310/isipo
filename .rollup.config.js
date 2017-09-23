const pug = require('rollup-plugin-pug')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')

const inputOptions = {
  plugins: [
    pug({
      compileDebug: true,
      sourceMap: true,
    }),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    }),
  ]
}

const outputOptions = {
  format: 'es'
}

module.exports = {
  inputOptions,
  outputOptions,
}
