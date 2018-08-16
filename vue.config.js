module.exports = {
  chainWebpack: config => {
      // GraphQL Loader
      config.module
        .rule('fbx')
        .test(/\.fbx$/)
        .use('raw-loader')
          .loader('raw-loader')
          .end()
    }
}