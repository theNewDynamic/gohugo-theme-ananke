---
title: Hero Section
date: 2026-01-16T08:00:00.000+0700
---

> [!NOTE]
> Work in progress. The information on this page is a copy paste result from old notes and documentation. Needs rewrite.

## Change the hero background

For any page or post you can add a featured image by including the local path in front matter (see content in the `exampleSite/content/en/_readme.md` file for examples): `featured_image = '/images/gohugo-default-sample-hero-image.jpg'`

## Featured image as Page Resources

If user is using [Page Resources](https://gohugo.io/content-management/page-resources/), the theme will try and match the `featured_image` from with a page resource of type `image` and use its relative permalink. If no `featured_image` is set, the theme will look for a Page Resource of type `image` whose filepath includes either `cover` or `feature`

## Other hero settings

If you would like to hide the header text on the featured image on a page, set `omit_header_text` to `true`. See `exampleSite/content/en/contact.md` for an example.

You don't need an image though. The default background color is black, but you can change the color, by changing the default color class in the config.toml file. Choose a background color from any on the [Tachyons](https://tachyons.io/docs/themes/skins/) library site, and preface it with "bg-"

example: `background_color_class = "bg-blue"` or `background_color_class = "bg-gray"`

The default fitting and alignment for the featured image is `cover bg-top`, but can be changed using the `featured_image_class`.  Choose a fitting and alignment style for the featured image using Tachyons classes such as "cover|contain" for fitting and "bg-top|bg-center|bg-bottom" for alignment.

example: `featured_image_class = "cover bg-center"` or `featured_image_class = "contain bg-top"`

The default cover backdrop for the featured image is `bg-black-60`, but can be changed using the `cover_dimming_class`.  Choose a color dimming class for the page or site header from any on the [Tachyons](https://tachyons.io/docs/themes/skins/) library site, preface it with "bg-" and add the value such as "-X0" where X is in [1,9]

example: `cover_dimming_class = "bg-black-20"` or `cover_dimming_class = "bg-white-40"`
