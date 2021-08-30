const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/javascripts/app.js',
  output: {
    path: 'assets',
    filename: 'app-[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/examples', to: 'examples' },
        {
          from: 'src/javascripts/P5SketchManager.js',
          to: 'P5SketchManager.js',
        },
      ],
    }),
  ],
};

module.exports = config;
