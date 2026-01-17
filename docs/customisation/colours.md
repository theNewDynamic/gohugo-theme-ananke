---
title: Colours
date: 2026-01-16T08:00:00.000+0700
---

> [!NOTE]
> Work in progress. The information on this page is a copy paste result from old notes and documentation. Needs rewrite.

## Set Content Font Color

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
