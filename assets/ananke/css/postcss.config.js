module.exports = {
	plugins: [
		require("postcss-import")({
			path: ["/assets/ananke/css"],
		})
	],
};