const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    alias: {
      "@constants": path.resolve(__dirname, "src/constants"),
      "@objects": path.resolve(__dirname, "src/objects"),
      "@models": path.resolve(__dirname, "src/models"),
      "@components": path.resolve(__dirname, "src/component"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@loaders": path.resolve(__dirname, "src/loaders"),
    },
    extensions: ['.ts', '.js']
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "static"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: "/node-modules/",
      },
    ],
  },
};
