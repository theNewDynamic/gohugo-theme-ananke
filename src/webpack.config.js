var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");
module.exports = {
	// context: path.resolve(__dirname, './src'),
	entry: {
		app: './js/main.js'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: 'css-loader?importLoaders=1!postcss-loader'
				})
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: [
					'url-loader?limit=10000',
					'img-loader'
				]
			}
		]
	},

	output: {
    path: path.join(__dirname, "./../static/dist"),
		filename: '[name].bundle.js',
	},

	resolve: {
		modules: [path.resolve(__dirname, 'src'), 'node_modules'],
	},

	plugins: [
		new ExtractTextPlugin("main.css"),
		new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
	],
	watchOptions: {
		watch: true
	}
}
