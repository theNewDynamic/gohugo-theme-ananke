---
title: Getting Started
date: 2026-01-16T08:00:00.000+0700
---

This guide summarizes the first configuration steps after installing Ananke.

## 1) Install the theme

Choose one installation method:

* [Installation as Hugo Module (recommended)](installation/gohugo-module.md)
* [Installation as Git Submodule](installation/git-submodule.md)

## 2) Confirm Hugo version compatibility

Ananke on `main` expects Hugo `0.146.0` or newer. Check with:

```bash
hugo version
```

## 3) Configure required basics

At minimum, configure:

* Site `title`
* `baseURL`
* Theme/module setup
* `params` values you want to customize

See:

* [General Configuration](configuration/general.md)
* [SEO Configuration](configuration/seo.md)
* [Social Media Networks](configuration/social-media-networks.md)

## 4) Add content and front matter

Start adding content and use front matter options supported by Ananke:

* [Front Matter Options](content/frontmatter.md)
* [General Content Features](content/general.md)
* [Reading Time](content/reading-time.md)
* [Shortcodes](content/shortcodes.md)

## 5) Customize visual style

For design and UI adjustments:

* [Hero section](customisation/hero-section.md)
* [Colors](customisation/colours.md)
* [Styles and CSS](customisation/styles.md)
* [Comments setup](customisation/comments.md)

## 6) Run and verify locally

Run Hugo locally and verify pages, menus, metadata, and social links:

```bash
hugo server
```

If you hit issues, see [Troubleshooting](troubleshooting.md).
