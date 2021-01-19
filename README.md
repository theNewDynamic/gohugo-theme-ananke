# Ananke, A theme for [Hugo](http://gohugo.io/), a framework for building websites.

The intent of this theme is to provide a solid starting place for Hugo sites with basic features and include best practices for performance, accessibility, and rapid development.

![screenshot](https://raw.githubusercontent.com/budparr/gohugo-theme-ananke/master/images/screenshot.png)

[DEMO](https://gohugo-ananke-theme-demo.netlify.com/)

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
- `HUGO_ENV`
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
- `.Site.Params.mainSections` to avoid hard-coding "blog," etc. [[release note](https://github.com/spf13/hugo/blob/66ec6305f6cb450ddf9c489854146bac02f7dca1/docs/content/meta/release-notes.md#enhancements)]


This theme uses the "Tachyons" CSS library. This will allow you to manipulate the design of the theme by changing class names in HTML without touching the original CSS files. For more information see the [Tachyons website](http://tachyons.io/).



## Installation

### As a Hugo Module (recommended)

1. Initiate the hugo module system if you haven't already:

   ```
   $ hugo mod init github.com/<your_user>/<your_project>
   ```

2. Add the theme's repo to your `config.toml`:

   ```toml
   theme = ["github.com/theNewDynamic/gohugo-theme-ananke"]
   ```

### As Git Submodule

Inside the folder of your Hugo site run:

```
$ git submodule add https://github.com/theNewDynamic/gohugo-theme-ananke.git themes/ananke
```
For more information read the official [setup guide](//gohugo.io/overview/installing/) of Hugo.



## Getting started

After installing the theme successfully it requires a just a few more steps to get your site running.


### The config file

Take a look inside the [`exampleSite`](https://github.com/theNewDynamic/gohugo-theme-ananke/tree/master/exampleSite) folder of this theme. You'll find a file called [`config.toml`](https://github.com/theNewDynamic/gohugo-theme-ananke/blob/master/exampleSite/config.toml). To use it, copy the [`config.toml`](https://github.com/theNewDynamic/gohugo-theme-ananke/blob/master/exampleSite/config.toml) in the root folder of your Hugo site. Feel free to change the strings in this theme.

You may need to delete the line: `themesDir = "../.."`


### Add comments

To enable comments, add following to your config file:

- DISQUS: `disqusShortname = YOURSHORTNAME`
- COMMENTO:
  ```
  [params]
    commentoEnable = true
  ```

### Change the hero background

For any page or post you can add a featured image by including the local path in front matter (see content in the `exampleSite/content/_readme.md` file for examples): `featured_image: '/images/gohugo-default-sample-hero-image.jpg'`

If you would like to hide the header text on the featured image on a page, set `omit_header_text` to `true`. See `exampleSite/content/contact.md` for an example.

You don't need an image though. The default background color is black, but you can change the color, by changing the default color class in the config.toml file. Choose a background color from any on the [Tachyons](http://tachyons.io/docs/themes/skins/) library site, and preface it with "bg-"

example: `background_color_class = "bg-blue"` or `background_color_class = "bg-gray"`



### Activate the contact form

This theme includes a shortcode for a contact form that you can add to any page (there is an example on the contact page in the exampleSite folder). One option is to use [formspree.io](//formspree.io/) as proxy to send the actual email. Each month, visitors can send you up to one thousand emails without incurring extra charges. Visit the Formspree site to get the "action" link and add it to your shortcode like this:

```
{{< form-contact action="https://formspree.io/your@email.com" >}}
```

### Update font or body classes

The theme is set, by default, to use a near-white background color and the "Avenir" or serif typeface. You can change these in your config file with the `body_classes` parameter, like this:

```
[params]
  body_classes = "avenir bg-near-white"
```

which will give you a body class like this:

```
<body class="avenir bg-near-white">
```

note: The `body_classes` parameter will not change the font used in post content. To do this, you must use the `post_content_classes` parameter.

You can find a list of available typefaces [here](https://github.com/tachyons-css/tachyons/blob/v4.7.0/src/_font-family.css).

And a list of background colors [here](https://github.com/tachyons-css/tachyons/blob/v4.7.0/src/_skins.css#L96).


_n.b. in future versions we will likely separate the typeface and other body classes._


### Custom CSS

You can override the built-in css by using your own. Just put your own css files in the `static` directory of your website (the one in the theme directory also works but is not recommended) and modify the `custom_css` parameter in your config file. The path referenced in the parameter should be relative to the `static` folder. These css files will be added through the `header` partial after the built-in css file.

For example, if your css files are `static/css/custom.css` and `static/css/custom2.css` then add the following to the config file:

```
    [params]
      custom_css = ["css/custom.css","css/custom2.css"]
```

### Processed CSS

By default, Ananke will read a preprocessed stylesheet from `/assets/ananke/dist/main.[hash].css`. If you want to have Hugo process the stylesheet for you thus allowing better customisation using Hugo's unison file system, you need to:

1. From the root of your project: `$ hugo mod npm pack`.  
This will generate a `package.json` for your project, or append the npm packages required by the theme to your existing `package.json`.
2. Still from the root of your project: `$ npm install`
3. Set the following site Parameter to true:

```
    [params]
      ananke_process_css = true
```

You're all set an can run Hugo.

#### Overwrite some imported file

To have your own `_code.css` imported and processed by the theme. Add `/assets/ananke/css/_code.css` to your project.

#### Add a new import

Create your own `/assets/ananke/css/` directory at the root of your project, drop your files in there, and create your own `/main.css` with your own import statements. Don't forget to include the existing import statement from the theme's own `main.css`.

### Show Reading Time and Word Count

If you add a key of `show_reading_time` true to either the Config Params, a page or section's front matter, articles will show the reading time and word count.


### Adding Scripts to the Page Head

Some scripts need to be added within the page head. To add your own scripts to the page head, simply insert them into the `head-additions.html` partial located in the `layouts/partials` folder.


### Logo

You can replace the title of your site in the top left corner of each page with your own logo. To do that put your own logo into the `static` directory of your website, and add the `site_logo` parameter to the site params in your config file. For example:

```
[params]
  site_logo = "img/logo.svg"
```


### Nearly finished

In order to see your site in action, run Hugo's built-in local server.

`$ hugo server`

Now enter [`localhost:1313`](http://localhost:1313/) in the address bar of your browser.

## Production

To run in production (e.g. to have Google Analytics show up), run `HUGO_ENV=production` before your build command. For example:

```
HUGO_ENV=production hugo
```

Note: The above command will not work on Windows. If you are running a Windows OS, use the below command:

```
set HUGO_ENV=production
hugo
```

## Contributing

If you find a bug or have an idea for a feature, feel free to use the [issue tracker](https://github.com/theNewDynamic/gohugo-theme-ananke/issues) to let me know.




TODO:

- fix hard-coded link to [section](https://github.com/theNewDynamic/gohugo-theme-ananke/blob/master/layouts/index.html#L32)
