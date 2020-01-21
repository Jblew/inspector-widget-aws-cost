const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  configureWebpack: config => {
    config.resolve.plugins = [
      new TsconfigPathsPlugin({
        logLevel: 'info',
        logInfoToStdOut: true,
      }),
    ];
  },

  lintOnSave: true,
};
