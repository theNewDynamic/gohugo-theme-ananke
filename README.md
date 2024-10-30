# Ananke, A theme for [Hugo](https://gohugo.io/), a framework for building websites

> [!WARNING]
> Parts of this documentation, such as the sections related to the production environment, are currently a work in progress. This is due to recent changes and updates in the theme. We are actively working on providing complete and up-to-date guidance. Thank you for your patience.

The intent of this theme is to provide a solid starting place for Hugo sites with basic features and include best practices for performance, accessibility, and rapid development.

![screenshot](https://raw.githubusercontent.com/budparr/gohugo-theme-ananke/master/images/screenshot.png)

[DEMO](https://ananke-theme.netlify.app/)

Features

- Responsive
- Accessible
- Contact form
- Custom Robots.txt (changes values based on environment)
- Internal templates for meta data, google analytics, and DISQUS or COMMENTO comments
- RSS Discovery
- Table of Contents (must declare `toc: true` in post parameter)
- Stackbit configuration ([Stackbit](https://www.stackbit.com))

Also includes examples of Hugo Features or Functions:

- Pagination (internal template)
- Taxonomies
- Archetypes
- Custom shortcode
- Related content
- Hugo built-in menu
- i18n
- `with`
- `first`
- `after`
- `sort`
- Site LanguageCode
- `where`
- Content Views
- Partials
- Template layouts (type "post" uses a special list template, single template, and a content view)
- Tags
- `len`
- Conditionals
- `ge` (greater than or equal to)
- `.Site.Params.mainSections` to avoid hard-coding "blog," etc. [[release note](https://github.com/gohugoio/hugo/blob/66ec6305f6cb450ddf9c489854146bac02f7dca1/docs/content/meta/release-notes.md#enhancements)]

This theme uses the "Tachyons" CSS library. This will allow you to manipulate the design of the theme by changing class names in HTML without touching the original CSS files. For more information see the [Tachyons website](https://tachyons.io/).

## Installation

### As a Hugo Module (recommended)

> ⚠️ If you installed a [Hugo binary](https://gohugo.io/getting-started/installing/#binary-cross-platform), you may not have Go installed on your machine. To check if Go is installed:
>
> ```bash
> go version
> ```
>
> Go modules were considered production ready in v1.14. [Download Go](https://golang.org/dl/).

1. From your project's root directory, initiate the hugo module system if you haven't already:

   ```bash
   hugo mod init github.com/<your_user>/<your_project>
   ```

2. Add the theme's repo to your `config.toml`:

   ```toml
   theme = ["github.com/theNewDynamic/gohugo-theme-ananke"]
   ```

### As Git Submodule

Inside the folder of your Hugo site run:

```bash
git submodule add https://github.com/theNewDynamic/gohugo-theme-ananke.git themes/ananke
```

For more information read the official [setup guide](//gohugo.io/getting-started/quick-start/) of Hugo.

## Getting started

After installing the theme successfully it requires a just a few more steps to get your site running.

### The config file

Take a look inside the [`exampleSite`](https://github.com/theNewDynamic/gohugo-theme-ananke/tree/master/exampleSite) folder of this theme. You'll find a file called [`config.toml`](https://github.com/theNewDynamic/gohugo-theme-ananke/blob/master/exampleSite/config.toml). To use it, copy the [`config.toml`](https://github.com/theNewDynamic/gohugo-theme-ananke/blob/master/exampleSite/config.toml) in the root folder of your Hugo site. Feel free to change the strings in this theme.

### Add comments

To enable comments, add following to your config file:

- DISQUS:

  ```toml
  [services.disqus]
    shortname = 'YOURSHORTNAME'
  ```

- COMMENTO:

  ```toml
  [params]
    commentoEnable = true
  ```

### Change the hero background

For any page or post you can add a featured image by including the local path in front matter (see content in the `exampleSite/content/en/_readme.md` file for examples): `featured_image = '/images/gohugo-default-sample-hero-image.jpg'`

#### Featured image as Page Resources

If user is using [Page Resources](https://gohugo.io/content-management/page-resources/), the theme will try and match the `featured_image` from with a page resource of type `image` and use its relative permalink. If no `featured_image` is set, the theme will look for a Page Resource of type `image` whose filepath includes either `cover` or `feature`

#### Other hero settings

If you would like to hide the header text on the featured image on a page, set `omit_header_text` to `true`. See `exampleSite/content/en/contact.md` for an example.

You don't need an image though. The default background color is black, but you can change the color, by changing the default color class in the config.toml file. Choose a background color from any on the [Tachyons](https://tachyons.io/docs/themes/skins/) library site, and preface it with "bg-"

example: `background_color_class = "bg-blue"` or `background_color_class = "bg-gray"`

The default fitting and alignment for the featured image is `cover bg-top`, but can be changed using the `featured_image_class`.  Choose a fitting and alignment style for the featured image using Tachyons classes such as "cover|contain" for fitting and "bg-top|bg-center|bg-bottom" for alignment.

example: `featured_image_class = "cover bg-center"` or `featured_image_class = "contain bg-top"`

The default cover backdrop for the featured image is `bg-black-60`, but can be changed using the `cover_dimming_class`.  Choose a color dimming class for the page or site header from any on the [Tachyons](https://tachyons.io/docs/themes/skins/) library site, preface it with "bg-" and add the value such as "-X0" where X is in [1,9]

example: `cover_dimming_class = "bg-black-20"` or `cover_dimming_class = "bg-white-40"`

### Activate the contact form

This theme includes a shortcode for a contact form that you can add to any page (there is an example on the contact page in the exampleSite folder). One option is to use [formspree.io](//formspree.io/) as proxy to send the actual email. Each month, visitors can send you up to fifty emails without incurring extra charges. Visit the Formspree site to get the "action" link and add it to your shortcode like this:

```go
{{< form-contact action="https://formspree.io/your@email.com" >}}
```

### Read more link

The homepage and other areas of the site use a `read more` link on the element. You can customize the copy of this link to make it more descriptive with the parameter `read_more_copy` available as a site and front matter parameter.

```toml
# config.toml
# Globally for all pages:
[params]
read_more_copy = "Read more about this entry"

# Just for french
[languages.fr]
name = "Français"
weight = 2

[languages.fr.params]
read_more_copy = "En savoir plus à ce sujet"
```

Using front matter and cascade, this can be customized for a whole section, or just for one page.

```yaml
# content/posts/tower-bridge-london.md
  title: The Tower Bridge of London
  read_more_copy: Read more about this bridge
```

### Social Follow + Share

Read the documentation for [social follow](https://github.com/theNewDynamic/gohugo-theme-ananke/wiki/Social-media-network-setup#configure-social-media-follow-links) and [social share](https://github.com/theNewDynamic/gohugo-theme-ananke/wiki/Social-media-network-setup#configure-social-media-share-links) in our wiki.

> This project uses Font Awesome brand icons, which are licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://github.com/FortAwesome/Font-Awesome/blob/6.x/LICENSE.txt). For more information, visit [Font Awesome](https://fontawesome.com/).

### Content indexing

If the theme is run in production, pages will be indexed by search engines. To prevent indexing on some given pages, add `private: true` to its Front Matter.

### Update font or body classes

The theme is set, by default, to use a near-white background color and the "Avenir" or serif typeface. You can change these in your config file with the `body_classes` parameter, like this:

```toml
[params]
  body_classes = "avenir bg-near-white"
```

which will give you a body class like this:

```go
<body class="avenir bg-near-white">
```

note: The `body_classes` parameter will not change the font used in post content. To do this, you must use the `post_content_classes` parameter.

You can find a list of available typefaces [here](https://github.com/tachyons-css/tachyons/blob/v4.7.0/src/_font-family.css).

And a list of background colors [here](https://github.com/tachyons-css/tachyons/blob/v4.7.0/src/_skins.css#L96).

_n.b. in future versions we will likely separate the typeface and other body classes._

### CSS

Ananke stylesheet is built with Hugo Pipes's [Asset Bundling](https://gohugo.io/hugo-pipes/bundling/#readout) alone to maximize compatibility. The theme simply bundles its several files into one minified and fingerprinted (in production) CSS file.

Ananke uses [Tachyons.io](https://tachyons.io/) utility class library.

#### Custom CSS

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

__Note on retrocompatibiliy for custom css__: If the files registered through the `custom_css` setting are not found in `assets/ananke/css` the theme will expect them to live at the given path relative to the static directory and load them as <link> requests.

### Show Reading Time and Word Count

If you add a key of `show_reading_time` true to either the Config Params, a page or section's front matter, articles will show the reading time and word count.

### Adding Scripts to the Page Head

Some scripts need to be added within the page head. To add your own scripts to the page head, simply insert them into the `head-additions.html` partial located in the `layouts/partials` folder.

### Logo

You can replace the title of your site in the top left corner of each page with your own logo. To do that put your own logo into the `static` directory of your website, and add the `site_logo` parameter to the site params in your config file. For example:

```toml
[params]
site_logo = "img/logo.svg"
```

### Set Content Font Color

You can set the font color of the main content both globally and on individual pages:

Globally:
Set the `text_color` param in the `config.toml` file.

```toml
[params]
text_color = "green"
```

Individual Page (prioritized over global):
Set the `text_color` param in a page's markdown file front matter.

note: The value of `text_color` must be a valid tachyons color class. A list can be found [here](https://tachyons.io/docs/themes/skins/).

### Localize date format

Dates of blog posts and single pages are rendered with the default date format commonly used in the USA and Canada. It is possible to specify a different format.

```toml
[params]
date_format = "2. January 2006"
```

With hugo 0.87.0 and above, you can also use predefined layout, like `:date_full`, and it will output localized dates or times.
See hugo's documentation of the [`time.Format` function](https://gohugo.io/functions/dateformat/) for more details.

### Using a canonical url

When you want to publish content that is already published on a different site. You need to reference a canonical url of the original content.
By defining the `canonicalUrl` in the front matter definition the canonical url is set in the headers.

```yaml
canonicalUrl: https://mydomain.com/path-to-the-oringinal-content/
```

### Nearly finished

In order to see your site in action, run Hugo's built-in local server.

```bash
hugo server
```

Now enter [`localhost:1313`](http://localhost:1313/) in the address bar of your browser.

## Contributing

If you find a bug or have an idea for a feature, feel free to use the [issue tracker](https://github.com/theNewDynamic/gohugo-theme-ananke/issues) to let me know.

Join me on my [ananke-theme Discord channel](https://discord.gg/MykHvyU5P3) for direct support.
