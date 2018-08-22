const webpack = require('webpack');
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        THREE: 'three'
      })
    ]
  },

  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule('fbx')
      .test(/\.fbx$/)
      .use('raw-loader')
        .loader('raw-loader')
        .end()
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'i18n',
      enableInSFC: true
    }
  }
}
