const PSCOUT = 'src/_psc-output'

const path = require('path')
const { exec } = require('child-process-promise')
const ramda = require('ramda')

const gulp = require('gulp')
const src = gulp.src.bind(gulp)

const rename = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')
const through = require('through2')
const watch = require('gulp-watch')

const pug = require('gulp-pug')

const postcss = require('gulp-postcss')
const { plugins: postcssPlugins, options: postcssOpts } = require('./postcss.config.js')

const rollup = require('gulp-better-rollup')
const { inputOptions: rollupIOpts, outputOptions: rollupOOpts } = require('./rollup.config.js')

// const babel = require('gulp-babel')

const pulp =
  () => exec(`if [ -f ./node_modules/.bin/psc-package ]; then pulp build -o ${PSCOUT} -- --source-maps; fi`)
    .then(({stdout, stderr}) => {
      if (stderr) {
        console.log('Building: Purescript modules')
        console.error(stderr.split('\n').slice(1, -2).join('\n'))
      } else {
        console.log('No Purescript modules to build')
      }
    })
    .catch(err => console.error(`stderr: ${err}`))
// const pulpEs = () => pulp()
//   .then(() => gulp.src(`${PSCOUT}/**/*.js`)
//     .pipe(sourcemaps.init())
//     .pipe(babel({
//       plugins: ['babel-plugin-transform-commonjs-es2015-modules']
//     }))
//     .pipe(sourcemaps.write(''))
//     .pipe(gulp.dest(PSCOUT))
//   )
//   .catch(err => console.error(`stderr: ${err}`))

const logInputs = () => through.obj((chunk, enc, cb) => {
  console.log('Building: ' + path.relative(__dirname, chunk.path))
  cb(null, chunk)
})

const batcher = (taskSet) => {
  const batches = {}
  ramda.forEachObjIndexed((tasks, name) => ramda.forEachObjIndexed((task, batch) => {
    const taskName = batch === 'default' ? name : name + '-' + batch
    if (typeof task === 'function') { gulp.task(taskName, task) } else { gulp.task(taskName, task.deps, task.task) }
    if (!batch.startsWith('_')) {
      if (!ramda.has(batch, batches)) batches[batch] = []
      batches[batch].push(taskName)
    }
  }, tasks), taskSet)
  Object.keys(batches).forEach(batch => gulp.task(batch, batches[batch], () => {}))
}

const tasksCommon = { // Every base task pipeline, given a source function

  copy: src => src([
    'src/**/*',
    'src/**/.*',
    '!src/**/*.pug',
    '!src/**/*.sss',
    '!src/**/*.purs',
    '!src/**/*.js',
    `!src/_*`, `!src/_*/**`,
    '!src/**/README*',
  ])
    .pipe(logInputs())
    .pipe(gulp.dest('./dist')),

  pug: src => src(['src/**/*.pug', '!src/_*/**/*'])
    .pipe(logInputs())
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest('dist')),

  postcss: src => src(['src/**/*.sss'])
    .pipe(logInputs())
    .pipe(postcss(postcssPlugins, postcssOpts))
    .pipe(rename({ extname: '.css' }))
    .pipe(gulp.dest('dist')),

  rollup: src => src(['src/**/index.js', `!${PSCOUT}/**`])
    .pipe(logInputs())
    .pipe(sourcemaps.init())
    .pipe(rollup(rollupIOpts, rollupOOpts))
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('dist')),

  sw: src => src([
    'src/**/sw.js',
  ])
    .pipe(logInputs())
    .pipe(gulp.dest('./dist')),

  favicon: src => src([
    'src/_assets/**/favicon/*.png',
    'src/_assets/**/linja-pona/*.otf',
  ])
    .pipe(logInputs())
    .pipe(gulp.dest('./dist/_assets')),

}
const tasksBatched = { // Task set overrides with broken down batches

  purescript: {
    default: pulp,
    watch: () => watch(['src/**/*.purs'], pulp)
  },

  rollup: {
    default: {
      deps: ['purescript'], // The JavaScript may depend on the Purescript.
      task: () => tasksCommon.rollup(src)
    },
    watch: () => watch(['src/**/*.js'], () => tasksCommon.rollup(src)) // Need to update build for deps changes
  },

  default: {
    test: () => console.log('Error: No test implemented')
  },

}
batcher(ramda.mergeDeepRight(
  ramda.map( // By default, every task can be run once, or set to watch
    task => ({ default: () => task(src), watch: () => task(watch) }),
    tasksCommon
  ),
  tasksBatched
))
