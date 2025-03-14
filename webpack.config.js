/* Import */
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

var license = fs.readFileSync('./LICENSE', 'utf-8');

/* Export config */
module.exports = [{
  mode: NODE_ENV='development' ? 'development' : undefined,
  context: __dirname,
  entry: {
    'dist/master-neat-browser': './src/index.ts',
    'dist/worker-browser': './src/multithreading/workers/browser/worker.ts'
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
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
  externals: [
    'child_process',
    'os'
  ],
  node: {
    __dirname: false
  }
}, {
  mode: NODE_ENV='development' ? 'development' : undefined,
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
    // library: 'MasterNeat',
    libraryTarget: 'commonjs-module'
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.BannerPlugin(license),
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
  externals: [
    'child_process',
    'os'
  ],
  node: {
    __dirname: false
  }
}, {
  entry: {
    'settings-builder': './misc/settings-builder/index.tsx'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
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
  mode: NODE_ENV='development' ? 'development' : undefined,
}, {
  entry: {
    './6-bars-predictor/setup': './examples/6-bars-predictor/setup.ts'
  },
  output: {
    path: path.resolve('./examples'),
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.mjs'],
    alias: {
      "lightweight-charts": path.resolve('./node_modules/lightweight-charts/dist/lightweight-charts.development.mjs')
    },
    fallback: {
      "path": require.resolve("path-browserify")
    }
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
  externals: {
    fs: 'throw new Error("no \'fs\'")',
  },
  devtool: 'source-map',
  mode: 'development' // NODE_ENV='development' ? 'development' : 'production',
}];
