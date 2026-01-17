---
title: Installation as Git Submodule
date: 2026-01-16T08:00:00.000+0700
---

# Installation as a Git Submodule (outdated)

Git Submodule based installation for the [Ananke theme](https://github.com/theNewDynamic/gohugo-theme-ananke) for [GoHugo](https://gohugo.io/).

## Methods

* [Install Ananke as GoHugo Module](Installation-as-GoHugo-Module)
* **[Install Ananke as Git Submodule](Installation-as-Git-Submodule) - this page**

## Requirements

1. [Install Hugo](https://gohugo.io/installation/linux/) (extended or extended/deploy edition, 0.128.0 or later)
2. [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Installation

To install or create a GoHugo website from scratch with the Ananke theme using the submodule method, follow these steps:

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

Clone the theme into the `themes` directory, adding it to your project as a [Git submodule].

```bash
git submodule add https://github.com/theNewDynamic/gohugo-theme-ananke.git themes/ananke
```

Append a line to the site configuration file, indicating the current theme.

```bash
echo "theme = 'ananke'" >> hugo.toml
```

Start Hugo's development server to view the site.

```bash
hugo server
```

Running this command will start the development server and you can see your website at <http://localhost:1313/>. To stop the development server press `Ctrl + C`.

To set up details like the comment system, follow the steps in the [Ananke theme's getting started guide](https://github.com/theNewDynamic/gohugo-theme-ananke#getting-started).
