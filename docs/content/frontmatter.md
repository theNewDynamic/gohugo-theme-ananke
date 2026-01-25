---
title: Frontmatter
date: 2026-01-16T08:00:00.000+0700
---

> [!NOTE]
> Work in progress. The information on this page is a copy paste result from old notes and documentation. Needs rewrite.

## Using a canonical url

If you want to publish content that is already published on a different site you need to reference a canonical URL of the original content. By defining the `canonicalUrl` in the front matter definition the canonical url is set in the headers.

```yaml
canonicalUrl: https://mydomain.com/path-to-the-original-content/
```

## Common Options

| Key              | Type    | Description                                                                 | Default             |
|------------------|---------|-----------------------------------------------------------------------------|---------------------|
| `title`          | string  | The title shown on the page and in metadata                                 | Required            |
| `linktitle`      | string  | Overrides the page title in menus and breadcrumbs                          | Uses `title`        |
| `summary`        | string  | Custom page summary shown in list views                                    | Auto-generated      |
| `description`    | string  | Meta description for SEO and previews                                      | Empty               |

## Example: Disabling Breadcrumbs

```toml
disableBreadcrumbs = true
```

This removes the breadcrumb trail from a single page layout.

---

## Example: Custom Layout

```toml
layout = "project"
```

This loads `layouts/_default/project.html` or a corresponding type fallback.

---

## Example: Using `linktitle`

```toml
title = "My Long Page Title"
linktitle = "Short Name"
```

This helps keep breadcrumbs and menus short while using a full title on the page.

---

## Defaults & Fallbacks

Most fields are optional. When not set:

* `linktitle` falls back to `title`
* `layout` is inferred from `type` or content section
* `summary` is generated from the first paragraph
* `description` may be empty unless manually added
* `disableBreadcrumbs` is `false` unless set

---

## Notes

These values apply to all content types and can be overridden per page. Consider using Archetypes for pre-filled front matter in your content structure.
