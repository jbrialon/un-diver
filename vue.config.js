const webpack = require('webpack');
module.exports = {
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
  }
}
