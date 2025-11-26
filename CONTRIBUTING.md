# Contributing to Ananke

Thank you for your interest in improving the Ananke Hugo theme! Contributions of all kinds help keep the theme useful for the community. This document explains how to get started, what kinds of contributions we welcome, and how to collaborate effectively.

## Types of Contributions

We welcome many forms of help, including:

* **Bug reports**: Tell us about problems you encounter and steps to reproduce them.
* **Feature requests**: Propose new capabilities or improvements to existing features.
* **Code contributions**: Fix bugs, add features, or improve build tooling.
* **Documentation updates**: Improve explanations, examples, or add missing details.
* **Translations**: Enhance or correct strings in the `i18n/` directory.

## Getting Started

1. Install [Hugo](https://gohugo.io/getting-started/installing/) extended version and ensure `hugo version` matches the version in `config/_default/hugo.toml` > `min_version`.
2. Install Node.js dependencies for asset building: `npm install`.
3. Run the development server with `hugo server` and open the served URL.

## Contribution Process

### Reporting Issues and Requesting Features

* Use [GitHub Issues](https://github.com/theNewDynamic/gohugo-theme-ananke/issues) to report bugs or [GitHub Discussions](https://github.com/theNewDynamic/gohugo-theme-ananke/discussions) to suggest enhancements.
* Include clear steps to reproduce, expected versus actual behavior, and environment details (e.g., Hugo version (the output of `hugo version`), OS, browser).
* Share screenshots or logs when relevant, but keep in mind to avoid sensitive information in public issues places.

### Submitting Code Changes

* Fork the repository and create a descriptive branch name (e.g., `fix/menu-alignment`).
* Keep changes focused and prefer smaller, reviewable pull requests.
* Create one pull request per logical change. 
* Follow the existing code style and structure; mirror patterns you see in `layouts/`, `assets/`, and `static/` (this will be updated with a link to coding standards as soon as we have them).
* Add or update documentation for any user-facing change.
* Write or update tests where applicable, then run them locally before opening a PR. Common commands:
  * `npm test` for JavaScript-related checks.
  * `hugo server` and `hugo` to verify the site builds without errors.
* Ensure commits have clear messages describing the intent. If your PR addresses an issue, reference it in the description (e.g., "Fixes #123").

### Documentation Contributions

* Update markdown files in `README.md`, `config/`, or relevant component docs to reflect your changes.
* Keep examples minimal but complete, and prefer showing the final output or screenshot references when helpful.

## Code of Conduct

Please review and follow the principles in the project's Code of Conduct (to be implemented). If you see behavior that violates these guidelines, report it through the project issue tracker or contact a maintainer privately.

## Communication and Support

* For general questions, open a discussion or issue on the repository.
* For security concerns, please avoid public issues and reach out to a maintainer directly when possible.

## Licensing

By contributing, you agree that your contributions will be licensed under the same terms as the project, as detailed in [LICENSE.md](LICENSE.md).
