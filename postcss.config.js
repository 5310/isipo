module.exports = {
  plugins: [
    require('postcss-nested'),
    require('postcss-nested-props'),
    require('postcss-mixins'),
    require('postcss-font-magician'),
    require('postcss-cssnext'),
  ],
  options: {parser: require('sugarss')}
}