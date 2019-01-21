var path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin


module.exports = {
	entry: __dirname + '/assets/js/index.js',
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		]
	},
	output: {
		filename: 'bundle.js',
		path: __dirname + '/listery/static/listery/js'
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
			Tether: 'tether'
		}),
		new BundleAnalyzerPlugin({
			generateStatsFile: true
		})
	],
	optimization: {
		sideEffects: true,
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'all'
				}
			},
			minSize: 30000,
			maxAsyncRequests: 5
		},
		minimizer: [
			new UglifyJsPlugin()
		]
    },
};
