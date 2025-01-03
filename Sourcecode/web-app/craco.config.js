const path = require('path');

module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.(js|mjs)$/,
            enforce: 'pre',
            loader: require.resolve('source-map-loader'),
            resolve: {
              fullySpecified: false
            }
          }
        ]
      },
      ignoreWarnings: [/Failed to parse source map/],
      resolve: {
        fallback: {
          "path": false,
          "fs": false
        }
      }
    }
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true
  }
}; 