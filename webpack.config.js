const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: './public/js/index.js',
  mode: 'development',
  target: 'electron-renderer',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist')
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  devServer: {
    static: 'public/dist'
  },

  module: {
    rules: [
      { test: /\.js$/, use: {loader: 'babel-loader', options: { presets: ['@babel/preset-react'] } }, exclude: '/node_modules/' },
      { test: /\.jsx$/,  use: {loader: 'babel-loader', options: { presets: ['@babel/preset-react'] } }, exclude: '/node_modules/' },
      { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
      { test: /\.(png|svg|jpg|jpeg|gif)$/i, type: 'asset/resource' }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inject: 'body'
    }),
  ]
}
