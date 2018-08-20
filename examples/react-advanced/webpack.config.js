const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPartialsPlugin = require('html-webpack-partials-plugin');
const HtmlWebpackRoutesPlugin = require('../../');

module.exports = {
  entry: {
    main: path.join(__dirname, './main.js')
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new HtmlWebpackPartialsPlugin({
      path: path.join(__dirname, './partials/body.html')
    }),
    new HtmlWebpackRoutesPlugin({
      app_root: '#custom-app-root-id',
      routes: [
        '/page1',
        {
          route: '/page2',
        },
        {
          route: '/page3',
          prerender: true,
        },
      ]
    })
  ]
};