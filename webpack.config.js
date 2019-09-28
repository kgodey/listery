var path = require('path')
var webpack = require('webpack')
/* Uncomment the line below for local bundle size analysis */
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin


module.exports = {
	entry: __dirname + '/listery/assets/web/js/index.js',
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
		path: __dirname + '/listery/static/listery/js/web'
	},
	plugins: [
		/* Uncomment the lines below for local bundle size analysis */
		// new BundleAnalyzerPlugin({
		// 	generateStatsFile: true
		// })
	],
	optimization: {
		sideEffects: true
	}
};
