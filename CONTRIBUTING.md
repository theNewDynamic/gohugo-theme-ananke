# Contributing to Ananke

Thanks for helping improve Ananke. This document describes the current contribution workflow for this repository.

## Ways to Contribute

* Report bugs
* Suggest enhancements
* Improve documentation
* Improve templates, styles, or assets
* Improve translations in `i18n/*.toml`

## Before You Start

1. Use a compatible Hugo version (see [`config/_default/hugo.toml`](https://github.com/theNewDynamic/gohugo-theme-ananke/blob/main/config/_default/module.toml](https://github.com/theNewDynamic/gohugo-theme-ananke/blob/main/config/_default/module.toml)) for the current state).
2. Install dependencies:

   ```bash
   npm install
   ```

3. Run a local preview via `npm run` instead of just calling `hugo server`:

   ```bash
   npm run server
   ```

   This runs the documentation site from `site/` using contents from `docs/` with local configuration.

## Reporting Bugs and Requesting Features

* Open bugs in [GitHub Issues](https://github.com/theNewDynamic/gohugo-theme-ananke/issues).
* Start feature or idea discussions in [GitHub Discussions](https://github.com/theNewDynamic/gohugo-theme-ananke/discussions).
* Include clear reproduction steps, expected behavior, actual behavior, and versions (`hugo version`, OS, browser if relevant).

## Pull Request Workflow

1. Fork the repository and create a focused branch.
2. Keep the change set small and cohesive (which means, DO NOT introduce multiple changes in a single PR).
3. Update docs for all user-facing changes.
4. Run quality checks locally:

   ```bash
   npm run lint:markdown
   ```

5. If your change affects behavior, validate with Hugo locally (for example `hugo` or `hugo server` in the relevant project).
6. Open a pull request with:
   * a clear summary,
   * motivation/context,
   * screenshots when UI/visual output changes,
   * linked issues (for example: `Fixes #123`).

## Documentation Contributions

Documentation lives in multiple places:

* Main project overview: `README.md`
* Contributor docs: `CONTRIBUTING.md`
* Theme docs content: `docs/`
* Docs site wrapper: `site/`

Please keep links relative where possible and remove stale references when updating pages.

## License

By contributing, you agree that your contributions are provided under the repository license in [LICENSE.md](LICENSE.md).
