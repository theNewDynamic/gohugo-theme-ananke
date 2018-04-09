var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
module.exports = {
	entry: {
		app: './js/main.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
						// plugins: [require('babel-plugin-transform-object-rest-spread')]
					}
				}
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader?importLoaders=1!postcss-loader'
				})
			}
		]
	},

	output: {
		path: path.join(__dirname, './../static/dist'),
		filename: 'js/[name].[chunkhash].js'
	},

	resolve: {
		modules: [path.resolve(__dirname, 'src'), 'node_modules']
	},

	plugins: [
		new ExtractTextPlugin({
			filename: getPath => {
				return getPath('css/[name].[contenthash].css');
			},
			allChunks: true
		})
		// new webpack.ProvidePlugin({
		//         $: "jquery",
		//         jQuery: "jquery"
		//     })
	],
	watchOptions: {
		watch: true
	}
};
