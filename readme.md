### A Base theme for [Hugo](http://gohugo.io/), a framework for building websites.

![screenshot](/images/screenshot.png)

[DEMO](http://gohugo-theme-example.netlify.com/)

The intent of this theme is to provide a solid starting place for Hugo sites and include best practices for performance, accessibility, and rapid development.

The demo sites contains a section called "Unit Tests," which are a work in progress, but eventually will allow theme developers to test against various edge cases that a theme's users might publish. (so, note, not all the tests are valid or appropriate here, they're present to start working on.)


Features
- Responsive
- Accessible

Includes examples of
- Custom Robots.txt (changes values based on environment)
- Internal templates for meta data and google analytics
- Pagination (internal template)
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
- Template layouts (type "article" uses a special list template, single template,  and a content view)
- Tags
- `len`
- Conditionals
- `ge` (greater than or equal to)


This theme uses the "Tachyons" CSS library. This will allow you to manipulate the design of the theme by changing class names in HTML without touching the original CSS files. For more information see the [Tachyons website](http://tachyons.io/).

TODO:
- ADD INSTRUCTIONS
- small dummy copyright notice with a formatted date could be added
- fix hard-coded link to section https://github.com/budparr/gohugo-default-theme/blob/master/layouts/index.html#L32
