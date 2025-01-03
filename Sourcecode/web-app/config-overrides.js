const webpack = require('webpack');

module.exports = function override(config) {
  // Add the moment locales webpack plugin configuration
  config.plugins.push(
    new webpack.ContextReplacementPlugin(
      /dayjs[/\\]locale$/,
      /en|es/
    )
  );

  return config;
}; 