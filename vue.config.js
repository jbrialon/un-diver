const webpack = require('webpack');
module.exports = {
  baseUrl: '/un-diver/',
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        THREE: 'three'
      })
    ]
  },

  pluginOptions: {
    i18n: {
      locale: 'us',
      fallbackLocale: 'us',
      localeDir: 'i18n',
      enableInSFC: true
    }
  },
  devServer: {
    watchOptions: {
      ignored: process.env.VUE_APP_SCREENSHOT ? /public/ : []
    }
  }
}
