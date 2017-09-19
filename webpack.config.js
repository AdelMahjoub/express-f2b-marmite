const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const autoPrefixer = require('autoprefixer');

const dev = process.env.WEBPACK_BUILD_MODE === 'dev';

const config = {
  entry: {
    bundle: ['./client/js/index.js']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: dev ? '[name].js' : '[name][chunkhash:8].js',
    publicPath: '/'
  },
  watch: dev,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader'
          },
          {
            loader: 'image-webpack-loader',
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(path.resolve(__dirname, './dist')),
    new ExtractTextPlugin({
      disable: dev,
      filename: '[name].[contenthash:8].css'
    })
  ],
  devtool: dev ? 'cheap-module-eval-source-map' : false,
}

if(!dev) {
  config.plugins.push(new UglifyJsPlugin());
  config.plugins.push(new ManifestPlugin());
}

module.exports = config;