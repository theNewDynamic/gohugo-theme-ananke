import type { Config } from "release-it";

const config = {
	npm: {
		publish: false,
	},
	git: {
		requireCleanWorkingDir: true,
		commit: true,
		commitMessage: "chore(release): v${version}",
		commitArgs: ["--no-verify"],
		tag: true,
		tagName: "v${version}",
		push: true,
		pushArgs: ["--follow-tags"],
	},
	github: {
		release: false,
	},
	plugins: {
		"@release-it/conventional-changelog": {
			infile: "CHANGELOG.md",
			preset: {
				name: "conventionalcommits",
				commitUrlFormat:
					"https://github.com/theNewDynamic/gohugo-theme-ananke/commit/{{hash}}",
				compareUrlFormat:
					"https://github.com/theNewDynamic/gohugo-theme-ananke/compare/{{previousTag}}...{{currentTag}}",
				types: [
					{ type: "feat", section: "Features" },
					{ type: "fix", section: "Bug Fixes" },
					{ type: "build", section: "Build" },
					{ type: "chore", section: "Chores" },
					{ type: "ci", section: "CI" },
					{ type: "docs", section: "Documentation" },
					{ type: "perf", section: "Performance" },
					{ type: "refactor", section: "Refactoring" },
					{ type: "revert", section: "Reverts" },
					{ type: "style", section: "Styles" },
					{ type: "test", section: "Tests" },
					{ type: "ai", section: "AI Instruction Files" },
				],
			},
			whatBump(commits: Array<{ type?: string; notes?: unknown[] }>) {
				let level: 2 | 1 | 0 | null = null;

				for (const commit of commits) {
					const notes = Array.isArray(commit.notes) ? commit.notes : [];
					const type = typeof commit.type === "string" ? commit.type : "";

					if (notes.length > 0) {
						return {
							level: 0,
							reason: "There are BREAKING CHANGES.",
						};
					}

					if (type === "feat") {
						level = 1;
						continue;
					}

					if (
						level === null &&
						[
							"fix",
							"build",
							"chore",
							"ci",
							"docs",
							"perf",
							"refactor",
							"revert",
							"style",
							"test",
							"ai",
						].includes(type)
					) {
						level = 2;
					}
				}

				if (level === null) {
					return false;
				}

				return {
					level,
					reason:
						level === 1
							? "There are feature commits."
							: "There are patch-level changes.",
				};
			},
		},
	},
} satisfies Config;

export default config;
