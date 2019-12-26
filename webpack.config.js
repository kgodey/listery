var path = require('path')
var webpack = require('webpack')
/* Uncomment the line below for local bundle size analysis */
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const env = process.env.NODE_ENV || 'development';


module.exports = {
	entry: {
		web: __dirname + '/listery/assets/js/web.js',
		mobile: __dirname + '/listery/assets/js/mobile.js'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: [
					(env === 'development' ? 'style-loader' : {
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '../'
						}
					}),
					'css-loader',
					'postcss-loader',
				],
			},
			{
				test: /\.(sa|sc)ss$/,
				use: [
					(env === 'development' ? 'style-loader' : {
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '../'
						}
					}),
					'css-loader',
					'postcss-loader',
					'sass-loader',
				],
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'fonts/[name].[ext]',
				},
			},
		]
	},
	output: {
		filename: '[name].js',
		path: __dirname + '/listery/static/listery'
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/app.css',
		}),
		/* Uncomment the lines below for local bundle size analysis */
		// new BundleAnalyzerPlugin({
		//	generateStatsFile: true
		// })
	],
	optimization: {
		sideEffects: true
	}
};
