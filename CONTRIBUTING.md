# Contributing to Ananke

Thanks for helping improve Ananke. This document describes the current contribution workflow for this repository.

- [Ways to Contribute](#ways-to-contribute)
- [Release Process](#release-process)
- [Before You Start](#before-you-start)
- [Reporting Bugs and Requesting Features](#reporting-bugs-and-requesting-features)
- [Pull Request Workflow](#pull-request-workflow)
- [Circumventing Git Hooks](#circumventing-git-hooks)
- [Documentation Contributions](#documentation-contributions)
- [Attribution](#attribution)
- [License](#license)

## Ways to Contribute

* Report bugs
* Suggest enhancements
* Improve documentation
* Improve templates, styles, or assets
* Improve translations in `i18n/*.toml`

## Release Process

The project follows a structured release workflow based on conventional commits, staging branches, and automated versioning.

For details, see [RELEASES.md](./RELEASES.md).

## Before You Start

1. Use a compatible Hugo version (see [`config/_default/module.toml`](https://github.com/gohugo-ananke/ananke/blob/main/config/_default/module.toml) for the current state).
2. Install dependencies:

   ```bash
   npm install
   ```

3. Run a local preview via `npm run` instead of just calling `hugo server`:

   ```bash
   npm run server
   ```

   This runs the documentation site from `site/` using contents from `docs/` with local configuration.

4. Follow the coding style and format commit messages as described in the conventional commits specification (for example: `docs: add troubleshooting section` or `fix: correct hero image path`).

5. Make sure to install git hooks for linting and testing before you push changes:

   ```bash
   npm run prepare
   ```

   This command is run automatically after `npm install` but you can run it manually to set up hooks in an existing clone or update changed hooks. It uses `simple-git-hooks` to install a commit hook that runs `lint-staged` for markdown files, which in turn runs linting tasks on staged files.

## Reporting Bugs and Requesting Features

* Open bugs in [GitHub Issues](https://github.com/gohugo-ananke/ananke/issues).
* Start feature or idea discussions in [GitHub Discussions](https://github.com/gohugo-ananke/ananke/discussions).
* Include clear reproduction steps, expected behaviour, actual behaviour, and versions (`hugo version`, OS, browser if relevant).

## Pull Request Workflow

1. Fork the repository and create a focused branch.
2. Keep the change set small and cohesive (which means, DO NOT introduce multiple changes in a single PR).
3. Update docs for all user-facing changes.
4. Run quality checks locally:

   ```bash
   npm run lint:markdown
   ```

5. If your change affects behaviour, validate with Hugo locally (for example `hugo` or `hugo server` in the relevant project).
6. Open a pull request with:
   * a clear summary,
   * motivation/context,
   * screenshots when UI/visual output changes,
   * linked issues (for example: `Fixes #123`).

## Circumventing Git Hooks

To prevent `git commit` and `git push` from running hooks you can use the `--no-verify` flag:

```bash
git commit --no-verify -m "docs: update README"
git push --no-verify origin my-feature-branch
```

This should be used sparingly and only when you have a good reason to bypass checks. If you find yourself needing to use `--no-verify` frequently, please consider improving the hooks or contributing fixes to reduce false positives.

## Documentation Contributions

Documentation lives in multiple places:

* Main project overview: `README.md`
* Contributor docs: `CONTRIBUTING.md`
* Theme docs content: `docs/`

Please keep links relative where possible and remove stale references when updating pages.

## Attribution

If you want to receive attribution for your contribution please follow the [contribution guidelines](https://allcontributors.org/en/bot/usage/) to add yourself to the list of contributors [in the Ananke theme documentation](https://github.com/davidsneighbour/gohugo-theme-ananke-documentation). A permanently open issue to add your contribution can be found [at the documentation repository](https://github.com/davidsneighbour/gohugo-theme-ananke-documentation/issues/1). Read the initial message to understand how to add yourself to the list of contributors.

## License

By contributing, you agree that your contributions are provided under the repository license in [LICENSE.md](LICENSE.md).
