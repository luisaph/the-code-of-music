var webpack = require("webpack");

const config = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: "./javascripts/app.jsx",
  output: {
    path: "assets",
    filename: "app-[hash].js"
  },
  module: {
    rules: [
    {
      test: /\.jsx$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react', '@babel/preset-env']
        }
      }
    }
  ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  }
};

module.exports = config;
