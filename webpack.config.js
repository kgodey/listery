var path = require('path')
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
		new BundleAnalyzerPlugin({
			generateStatsFile: true
		})
	],
	optimization: {
		sideEffects: true
	},
	resolve: {
		alias: {
			'react': 'preact-compat',
			'react-dom': 'preact-compat'
		}
	}
};
