---
title: General Configuration
date: 2026-01-16T08:00:00.000+0700
---

> [!IMPORTANT]
> Please note that GoHugo is extensible configurable with more generic or more specific configuration. Please read the documentation about [configuration files](https://gohugo.io/configuration/introduction/#configuration-file) and [configuration directories](https://gohugo.io/configuration/introduction/#configuration-directory) to learn more about this topic. Whenever Ananke's documentation refers to the configuration file it refers to any of these possible locations.
>
> Ananke's sample repositories are using configuration directories and you can find all referred configuration parameters in `config/_default/hugo.toml` and `config/_default/params.toml`.

> [!NOTE]
> Work in progress. The information on this page is a copy paste result from old notes and documentation. Needs rewrite.

### Activate the contact form

This theme includes a shortcode for a contact form that you can add to any page (there is an example on the contact page in the exampleSite folder). One option is to use [formspree.io](//formspree.io/) as proxy to send the actual email. Each month, visitors can send you up to fifty emails without incurring extra charges. Visit the Formspree site to get the "action" link and add it to your shortcode like this:

```go-html-template
{{</* form-contact action="https://formspree.io/your@email.com" */>}}
```

### Logo

You can replace the title of your site in the top left corner of each page with your own logo. To do that put your own logo into the `static` directory of your website, and add the `site_logo` parameter to the site params in your config file. For example:

```toml
[params]
site_logo = "img/logo.svg"
```

### Localize date format

Dates of blog posts and single pages are rendered with the default date format commonly used in the USA and Canada. It is possible to specify a different format.

```toml
[params]
date_format = "2. January 2006"
```

With hugo 0.87.0 and above, you can also use predefined date layouts, like `:date_full`, and it will output localized dates or times. See hugo's documentation of the [`time.Format` function](https://gohugo.io/functions/dateformat/) for more details.
