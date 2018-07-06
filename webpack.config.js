var path = require('path')
var webpack = require('webpack')


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
		path: __dirname + '/listery/static/listery_v2/js'
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
			Tether: 'tether'
		})
	]
};
