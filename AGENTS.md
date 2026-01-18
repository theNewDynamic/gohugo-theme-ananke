# AGENTS.md

## Project Overview

This repository contains the Ananke theme for the Hugo static site generator. It provides layouts, assets, and configuration to build accessible, responsive sites that leverage Tachyons utility classes.

## Development Environment Tips

* Use the **Hugo Extended** binary to ensure SCSS/asset pipelines work. Hugo 0.139 or newer is recommended.
* Install Node.js 18+ if you plan to run the release tooling defined in `package.json`. Regular theme development generally only needs Hugo.
* From the repository root, run `hugo server -D` to start a local preview with draft content.
* When editing styles, prefer Hugo Pipes and Tachyons utility classes rather than adding new global CSS files.

## Build and Test Instructions

* Build the theme example site with `hugo --minify` to verify templates and assets render correctly.
* Run `npm install` followed by `npm run lint:md` or `npm run biome` if you add corresponding scripts in local setup; the project uses Biome and markdownlint configs for linting.
* Check for broken links or front matter issues by running `hugo server -D` and inspecting console output for warnings.

## Code Style Guidelines

* Favor Hugo template primitives and partials already present under `layouts/` before introducing new ones.
* Keep front matter parameters and `.Site.Params` usage consistent with existing patterns in `exampleSite` and `config/` files.
* Prefer Tachyons utility classes for styling; avoid inline styles unless necessary.
* Keep markdown readable and wrap lines at ~120 characters where practical.

## Commit and Pull Request Guidelines

* Use conventional-style commit messages (e.g., `feat: add new shortcode`, `fix: correct hero background config`).
* Keep commits focused; avoid mixing unrelated changes.
* For pull requests, include:
  * A concise summary of user-facing changes.
  * Testing steps and commands executed.
  * Notes about documentation updates or migration steps when applicable.

## Security Considerations

* Do not commit secrets or API keys. Configuration values intended for publication should live in `config/` or `exampleSite` front matter only.
* Validate any external resources or scripts added to templates for integrity and privacy implications.

## Deployment Notes

* The theme is consumed as a Hugo module or git submodule. Ensure `theme.toml` and `package.hugo.json` remain up to date when adding new assets or translations.
* When preparing a release, follow the Wireit-based scripts in `package.json` to tag versions.

## Nested Instructions

* If you add sub-projects or specialized areas (e.g., a new service folder), create additional `AGENTS.md` files within those directories to override or extend these rules for that scope.
