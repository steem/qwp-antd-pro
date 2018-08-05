const path = require('path');

module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          components: path.join(__dirname, './src/components'),
          utils: path.join(__dirname, './src/utils'),
          layouts: path.resolve(__dirname, 'src/layouts'),
          models: path.resolve(__dirname, 'src/models'),
          requests: path.join(__dirname, './src/requests'),
          assets: path.resolve(__dirname, 'src/assets'),
        },
      },
    ],
    [
      'import',
      {
        libraryName: 'antd',
        style: true, // or 'css'
      },
    ],
  ],
};
