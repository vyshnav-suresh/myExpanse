module.exports = {
    // Other webpack configurations...
  
    module: {
      rules: [
        // Other rules...
  
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          exclude: /node_modules/,
          use: [
            'file-loader'
          ]
        },
        {
          test: /\.node$/,
          exclude: /node_modules/,
          use: [
            'node-loader'
          ]
        }
      ]
    }
  };