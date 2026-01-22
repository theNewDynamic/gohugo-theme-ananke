---
title: Installation
date: 2026-01-16T08:00:00.000+0700
---

## Installing the Ananke Theme for Hugo

> [!NOTE]
> This post was published and might have updates at [kollitsch.dev](https://kollitsch.dev/posts/installing-ananke-theme-hugo/)

If you're following the [Hugo Quickstart guide](https://gohugo.io/getting-started/quick-start/), you'll notice that it currently recommends installing the Ananke theme as a **Git submodule**. While this is a valid approach, Hugo also offers a more powerful alternative: **Hugo Modules**, which leverage Go's module system for better dependency management.

There are two primary ways to install Ananke:

1. **Hugo Module** --- Uses Hugo's built-in Go module system to fetch and manage the theme as a package.
2. **Git Submodule** *(Legacy Method)* --- Links the theme repository as a submodule inside your Hugo project.

### Comparison: Hugo Module vs. Git Submodule

| Method                                                               | Pros                                                             | Cons                                                      |
| -------------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------- |
| [**Hugo Module**](Installation-as-GoHugo-Module) *(Preferred)*       | Easier version management, automatic updates, better integration | Requires Go installed and initial setup                   |
| [**Git Submodule**](Installation-as-Git-Submodule) *(Legacy Method)* | Simple if you're already using Git                               | Requires manual updates, can be tricky with Git workflows |

**Recommendation:** The **Hugo Module approach is preferred**, as it provides a more flexible and future-proof way to manage themes.

For step-by-step installation instructions, refer to these **work-in-progress** sample repositories:
* **Hugo Module installation (preferred):** [gohugo-theme-ananke-template-mod](https://github.com/davidsneighbour/gohugo-theme-ananke-template-mod)
* **Git Submodule installation (Legacy Method):** [gohugo-theme-ananke-template-submod](https://github.com/davidsneighbour/gohugo-theme-ananke-template-submod)
