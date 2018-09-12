const path = require('path');
const config = require('./src/utils/config');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  externals: {
    '@antv/data-set': 'DataSet',
    rollbar: 'rollbar',
  },
  alias: {
    components: path.resolve(__dirname, 'src/components'),
    requests: path.resolve(__dirname, 'src/requests'),
    layouts: path.resolve(__dirname, 'src/layouts'),
    models: path.resolve(__dirname, 'src/models'),
    utils: path.resolve(__dirname, 'src/utils'),
    common: path.resolve(__dirname, 'src/common'),
    assets: path.resolve(__dirname, 'src/assets'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  disableDynamicImport: config.isDesktop || false,
  publicPath: '/',
  hash: true,
  proxy: {
    '/antd/services': {
      target: 'http://localhost/antd',
      changeOrigin: true,
      pathRewrite: {'^/antd/services' : ''}
    }
  },
};
