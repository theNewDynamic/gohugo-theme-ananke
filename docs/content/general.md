---
title: General
date: 2026-01-16T08:00:00.000+0700
---

> [!NOTE]
> Work in progress. The information on this page is a copy paste result from old notes and documentation. Needs rewrite.

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

### Show Reading Time and Word Count

If you add a key of `show_reading_time` true to either the Config Params, a page or section's front matter, articles will show the reading time and word count.
