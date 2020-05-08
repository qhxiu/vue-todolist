module.exports = {
  plugins: [
    // 有一些需要加浏览器前缀的css属性，autoprefixer自动帮这些属性加上前缀
    require('autoprefixer')()
  ]
}