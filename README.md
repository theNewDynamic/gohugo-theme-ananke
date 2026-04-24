# Ananke Theme for Hugo

Ananke is a flexible, production-ready starter theme for [Hugo](https://gohugo.io/) focused on accessibility, performance, and maintainable defaults.

![Ananke screenshot](images/screenshot.png)

* Demo: [ananke-theme.netlify.app](https://ananke-theme.netlify.app/)
* Documentation: [docs directory](https://github.com/gohugo-ananke/ananke/tree/main/docs)
* Changelog: [CHANGELOG.md](CHANGELOG.md)

> [!IMPORTANT]
>
> Ananke moved to its own organisation on April 23, 2026. Please update your references from `github.com/theNewDynamic/gohugo-theme-ananke` to `github.com/gohugo-ananke/ananke`. Bear with us as we update all documentation and links to reflect this change. Until then, both URLs will continue to work as links as well as in the `git` operations for cloning and submodules.
>
> The following steps should suffice to update your references if you have not changed the setup:
>
> **For Hugo Modules:** search and replace all instances of `github.com/theNewDynamic/gohugo-theme-ananke/v2` with `github.com/gohugo-ananke/ananke/v2` in your site's configuration and run `hugo mod tidy` to update the module dependencies.
>
> **For Git Submodules:** To change the remote URL for your existing submodule, run:
>
> ```bash
> cd path/to/your/repo/themes/ananke # <-- adjust path as needed, keep the 'themes/ananke' part
> git remote set-url origin https://github.com/gohugo-ananke/ananke.git
> ```
>
> Then find `.gitmodules` in the root of your repository and replace all instances of `theNewDynamic/gohugo-theme-ananke` with `gohugo-ananke/ananke` in that file as well.
> Finally, run `git submodule sync` to update the submodule configuration.
>
> **Issues?** Get in touch via [GitHub Discussions](https://github.com/orgs/gohugo-ananke/discussions/944).

## Features

* Responsive layouts and accessible markup
* Configurable hero/header behaviour
* Configurable social follow/share links
* Optional contact form shortcode
* Localized i18n strings in many languages
* SEO defaults with Hugo internal templates
* Reading time/word count support
* Robots.txt handling by environment

## Installation

Ananke supports both installation methods:

* [Install as Hugo Module (recommended)](docs/en/installation/gohugo-module.md)
* [Install as Git Submodule](docs/en/installation/git-submodule.md)

If you are new to Hugo, see Hugo's official quick start: [gohugo.io/getting-started/quick-start](https://gohugo.io/getting-started/quick-start/).

## Getting Started

After installation, use these guides to configure your site:

* [Getting Started](docs/en/getting-started.md)
* [Configuration](docs/en/configuration/_index.md)
* [Customisation](docs/en/customisation/_index.md)
* [Troubleshooting](docs/en/troubleshooting.md)

## Support and Contributions

* Bug reports: [GitHub Issues](https://github.com/gohugo-ananke/ananke/issues)
* Questions and feature ideas: [GitHub Discussions](https://github.com/gohugo-ananke/ananke/discussions)
* Contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md)
