# Routes for HTML Webpack Plugin

[![CircleCI Status](https://circleci.com/gh/colbyfayock/html-webpack-routes-plugin.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/colbyfayock/html-webpack-routes-plugin) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/colbyfayock/html-webpack-routes-plugin/blob/master/LICENSE)

Extends [HTML Webpack Plugin](https://github.com/jantimon/html-webpack-plugin) to add support for cloning routes and prerendering them.

Note: prerender functionality is still a WIP, may not work as expected


## Installation
```
yarn add html-webpack-routes-plugin -D
```
or
```
npm add html-webpack-routes-plugin --save-dev
```

## Usage

Require the plugin in your webpack config:
```
const HtmlWebpackRoutesPlugin = require('html-webpack-routes-plugin');
```

Add the plugin to your webpack config as follows:
```
plugins: [
  new HtmlWebpackPlugin(),
  new HtmlWebpackRoutesPlugin([
    '/page1',
    '/page2'
  ])
]
```

### Settings
| Name      | Type     | Default | Description
|:---------:|:--------:|:-------:|:----------|

TODO

## Examples

TODO

### Other Examples
See a few other working examples here: https://github.com/colbyfayock/html-webpack-routes-plugin/tree/master/examples
