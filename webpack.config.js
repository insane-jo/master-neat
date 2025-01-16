/* Import */
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var license = fs.readFileSync('./LICENSE', 'utf-8');

/* Export config */
module.exports = {
  mode: 'production',
  context: __dirname,
  entry: {
    'dist/master-neat': './src/index.ts',
    'dist/worker': './src/multithreading/workers/node/worker.ts'
  },
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules')
    ],
    fallback: {
      "path": require.resolve("path-browserify")
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: __dirname,
    filename: '[name].js',
    library: 'MasterNeat',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.BannerPlugin(license),
    new webpack.optimize.ModuleConcatenationPlugin(),
    // new CopyWebpackPlugin([
    //   { from: 'src/multithreading/workers/node/worker.js', to: 'dist' }
    // ])
  ],
  externals: [
    'child_process',
    'os'
  ],
  node: {
    __dirname: false
  }
};
