---
title: Installation as GoHugo Module
date: 2026-01-16T08:00:00.000+0700
---

# Installation as a Hugo Module (recommended)

Hugo Module based installation for the [Ananke theme](https://github.com/theNewDynamic/gohugo-theme-ananke) for [GoHugo](https://gohugo.io/).

## Methods

* **[Install Ananke as GoHugo Module](Installation-as-GoHugo-Module) - this page**
* [Install Ananke as Git Submodule](Installation-as-Git-Submodule)

## Requirements

1. [Install Hugo](https://gohugo.io/installation/linux/) (extended or extended/deploy edition, 0.128.0 or later)
2. [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
3. [Install Golang](https://golang.org/doc/install)

## Installation

To install or create a GoHugo website from scratch with the Ananke theme using the *GoHugo Module* method, follow these steps:

Verify that you have installed Hugo 0.128.0 or later.

```bash
hugo version
```

Create the project structure `quickstart` directory:

```bash
hugo new site quickstart
```

Change into the newly created directory:

```bash
cd quickstart
```

Initialize Git in the current directory:

```bash
git init
```

Initialize your repository as a Hugo Module:

```bash
hugo mod init github.com/username/reponame
```

Note: replace username and reponame with the path to your repository. This is a convention that is not enforced, of course your module can be named anything you like, but it is recommended to use the same path as your repository.

Add the Ananke theme as a Hugo Module:

```toml
[module]
[[module.imports]]
disable = false
ignoreConfig = false
ignoreImports = false
path = 'github.com/theNewDynamic/gohugo-theme-ananke/v2'
```

Note: Hugo configuration can have various formats and locations. The previous lines are written in the `hugo.toml` or `config.toml` file at the root of the project. If you have a different configuration file or format it could be that you need to add the module configuration in a different way.

Note: `v2` is required to use the latest published version of Ananke.

Now update the module configuration by running:

```bash
hugo mod get -u ./...
hugo mod tidy
```

This will load the module into the cache and create/update the `go.mod` and `go.sum` files. These two files should be added to your repository.

Start Hugo's development server to view the site.

```bash
hugo server
```

Running this command will start the development server and you can see your website at <http://localhost:1313/>. To stop the development server press `Ctrl + C`.

To set up details like the comment system, follow the steps in the [Ananke theme's getting started guide](https://github.com/theNewDynamic/gohugo-theme-ananke#getting-started).
