// @see https://github.com/lint-staged/lint-staged

/**
 * @filename: .lintstagedrc.js
 * @type {import('lint-staged').Configuration}
 */
export default {
	"*.{json,jsonc}": ["biome check --write --staged"],
	// '.github/workflows/**/*.y(a?)ml': [
	//   'zizmor --no-exit-codes',
	// ],
	"package-lock.json": [
		"lockfile-lint --path package-lock.json --validate-https --allowed-hosts npm",
	],
	"*.{ts,tsx,(m|c)js,jsx}": (/** @type {string[]} */ files) => {
		return [`biome check --write --no-errors-on-unmatched ${files.join(" ")}`];
	},
	// '*.yaml': ['yamllint -c .yamllint.yml'],
	// '*.{scss,css}': ['stylelint --fix', "prettier --write"],
	// '*.{png,jpeg,jpg,gif,svg}': [
	//   'imagemin-lint-staged' // @davidsneighbour/imagemin-lint-staged
	// ],
	"!(CHANGELOG)**/*.{md,markdown}": [
		// 'npm run lint:links',
		"npm run lint:markdown:fix",
	],
	"**/*.ts?(x)": () => ["tsc -p tsconfig.json --noEmit"],
	// 'layouts/**/*.*': [
	//   './bin/hugo/refactor layouts'
	// ],
};
