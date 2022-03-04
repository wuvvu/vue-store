
module.exports = {
  publicPath: './',
  devServer: {
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8081/', // 本地后端地址
        // target: 'http://home.wuvvu.cn:3000/', // 线上后端地址
        changeOrigin: true, //允许跨域
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}