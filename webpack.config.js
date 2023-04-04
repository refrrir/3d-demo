const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      "@colors": path.resolve(__dirname, "src/colors"),
      "@objects": path.resolve(__dirname, "src/objects"),
      "@models": path.resolve(__dirname, "src/models"),
    }
  }
};