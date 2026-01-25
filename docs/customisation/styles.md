---
title: Styles
date: 2026-01-16T08:00:00.000+0700
---

> [!NOTE]
> Work in progress. The information on this page is a copy paste result from old notes and documentation. Needs rewrite.

## Update font or body classes

The theme is set, by default, to use a near-white background color and the "Avenir" or serif typeface. You can change these in your config file with the `body_classes` parameter, like this:

```toml
[params]
  body_classes = "avenir bg-near-white"
```

which will give you a body class like this:

```html
<body class="avenir bg-near-white">
```

note: The `body_classes` parameter will not change the font used in post content. To do this, you must use the `post_content_classes` parameter.

You can find a list of available typefaces [here](https://github.com/tachyons-css/tachyons/blob/v4.7.0/src/_font-family.css).

And a list of background colors [here](https://github.com/tachyons-css/tachyons/blob/v4.7.0/src/_skins.css#L96).

## CSS

Ananke stylesheet is built with Hugo Pipes's [Asset Bundling](https://gohugo.io/hugo-pipes/bundling/#readout) alone to maximize compatibility. The theme simply bundles its several files into one minified and fingerprinted (in production) CSS file.

Ananke uses [Tachyons.io](https://tachyons.io/) utility class library.

## Custom CSS

WARNING: Pending resolution of this [discussion](https://github.com/theNewDynamic/gohugo-theme-ananke/discussions/452#discussioncomment-1865301), Custom CSS only works with Hugo Extended

In order to complement the default CSS with your own, you can add custom css files to the project.

1. Just add a `assets/ananke/css` directory to your project and add the file(s) in it.
2. Register the files using the `custom_css` key in your site's parameter. The path referenced in the parameter should be relative to the `assets/ananke/css` folder.

The css files will be added in their registered order to final `main.css` file.

For example, if your css files are `assets/ananke/css/custom.css` and `assets/ananke/special.css` then add the following to the config file:

```toml
[params]
custom_css = ["custom.css","special.css"]
```

__IMPORTANT__: Files registered through the `custom_css` array, while unlimited in number, must be of the same type (Ex: all `scss` or all `css`)

__Note on retrocompatibility for custom css__: If the files registered through the `custom_css` setting are not found in `assets/ananke/css` the theme will expect them to live at the given path relative to the static directory and load them as `<link>` requests.
