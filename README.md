# Ananke, A theme for [Hugo](http://gohugo.io/), a framework for building websites.

The intent of this theme is to provide a solid starting place for Hugo sites with basic features and include best practices for performance, accessibility, and rapid development.

![screenshot](https://raw.githubusercontent.com/budparr/gohugo-theme-ananke/master/images/screenshot.png)

[DEMO](https://gohugo-ananke-theme-demo.netlify.com/)

Features

- Responsive
- Accessible
- Contact form
- Custom Robots.txt (changes values based on environment)
- Internal templates for meta data and google analytics
- RSS Discovery

Also includes examples of Hugo Features or Functions:

- Pagination (internal template)
- Taxonomies
- Archetypes
- Custom shortcode
- Hugo built-in menu
- `with`
- `HUGO_ENV`
- `first`
- `after`
- `sort`
- Site LanguageCode
- `where`
- Content Views
- Partials
- Template layouts (type "post" uses a special list template, single template,  and a content view)
- Tags
- `len`
- Conditionals
- `ge` (greater than or equal to)
- `.Site.Params.mainSections` to avoid hard-coding "blog," etc. [[release note](https://github.com/spf13/hugo/blob/66ec6305f6cb450ddf9c489854146bac02f7dca1/docs/content/meta/release-notes.md#enhancements)]


This theme uses the "Tachyons" CSS library. This will allow you to manipulate the design of the theme by changing class names in HTML without touching the original CSS files. For more information see the [Tachyons website](http://tachyons.io/).



## Installation

Inside the folder of your Hugo site run:

    $ cd themes
    $ git clone https://github.com/budparr/gohugo-theme-ananke.git

For more information read the official [setup guide](//gohugo.io/overview/installing/) of Hugo.



## Getting started

After installing the theme successfully it requires a just a few more steps to get your site running.


### The config file

Take a look inside the [`exampleSite`](https://github.com/budparr/gohugo-theme-ananke/tree/master/exampleSite) folder of this theme. You'll find a file called [`config.toml`](https://github.com/budparr/gohugo-theme-ananke/blob/master/exampleSite/config.toml). To use it, copy the [`config.toml`](https://github.com/budparr/gohugo-theme-ananke/blob/master/exampleSite/config.toml) in the root folder of your Hugo site. Feel free to change the strings in this theme.

You may need to delete the line: `themesDir = "../.."`


### Change the hero background

For any page or post you can add a featured image by including the local path in front matter (see content in the ExampleSite folder for examples): `featured_image: '/images/gohugo-default-sample-hero-image.jpg'`

You don't need an image though. The default background color is black, but you can change the color, by changing the default color class in the config.toml file. Choose a background color from any on the [Tachyons](http://tachyons.io/docs/themes/skins/) library site, and preface it with "bg-"

example: `background_color_class = "bg-blue"` or `background_color_class = "bg-gray"`



### Activate the contact form

This theme includes a shortcode for a contact form that you can add to any page (there is an example on the contact page in the exampleSite folder). One option is to use [formspree.io](//formspree.io/) as proxy to send the actual email. Each month, visitors can send you up to one thousand emails without incurring extra charges. Visit the Formspree site to get the "action" link and add it to your shortcode like this:

```
{{< form-contact action="http://formspree.io/your@email.com" >}}
```


### Nearly finished

In order to see your site in action, run Hugo's built-in local server.

`$ hugo server`

Now enter [`localhost:1313`](http://localhost:1313/) in the address bar of your browser.


## Contributing

If you find a bug or have an idea for a feature, feel free to use the [issue tracker](https://github.com/budparr/gohugo-theme-ananke/issues) to let me know.




TODO:

- fix hard-coded link to [section](https://github.com/budparr/gohugo-theme-ananke/blob/master/layouts/index.html#L32)
