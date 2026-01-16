---
title: Shortcodes
date: 2026-01-16T08:00:00.000+0700
---

> [!NOTE]
> Work in progress. The information on this page is a copy paste result from old notes and documentation. Needs rewrite.

### 📄 `shortcodes-index.md`

```md
# Shortcodes

Shortcodes are reusable content snippets that simplify complex HTML structures in Markdown files.

Use shortcodes with the `{{/*< >*/}}` or `{{/*% %*/}}` syntax in your content files.

---

## Available Shortcodes

| Name      | Purpose                       | Example Usage                             |
|-----------|-------------------------------|--------------------------------------------|
| `figure`  | Responsive image with caption | `{{/*< figure src="/img/example.jpg" caption="An image" >*/}}` |
| `button`  | Renders a styled button       | `{{/*< button href="/contact" */>}}Say Hello{{/*< /button >*/}}` |
| `highlight` | Syntax highlighting (fallback) | `{{/*< highlight html >*/}}...{{/*< /highlight >*/}}` |

> 💡 These shortcodes can be extended or replaced in your own project. Place overrides under `layouts/shortcodes/`.

---

## Example: `figure` Shortcode

### Markdown

```md
{{< figure src="/images/cat.jpg" caption="This is a cat" >}}
```

### Output

```html
<figure>
  <img src="/images/cat.jpg" alt="This is a cat">
  <figcaption>This is a cat</figcaption>
</figure>
```

---

## Notes

* You can override or create new shortcodes by placing them in your project’s `layouts/shortcodes/` folder.
* Always prefer shortcodes over raw HTML in content files for portability.

```

---

### 📄 `partials-index.md`

```md
# Partials and Components

Partials are reusable template blocks used in layouts and components. They simplify common rendering tasks.

---

## Breadcrumbs Partial

Location: `partials/content/components/breadcrumbs.html`

### Purpose

Renders a breadcrumb trail with microdata support. Automatically pulls from page hierarchy and supports overrides.

### Features

* Uses `linktitle` if present.
* Configurable separator via SCSS variable.
* Adds SEO microdata for search engines.
* Can be disabled per page.



## Debug Toggle Partial

Location: `partials/components/debug-toggle.html`

### Purpose

Toggles developer overlays like spacing grids and outline borders via Alpine.js.

### Example

Add this partial in your base layout (only in development):

```gohtml
{{ partial "components/debug-toggle.html" . }}
```

Includes toggles for:
* Grid overlay
* Outline borders
* Spacing rulers

---

## Notes

* All partials can be overridden in your own theme or site by copying them to the same path under `layouts/partials/`.
* Avoid directly modifying theme partials unless you control the upstream theme.

```

---

### ✅ Removed from `Readme.md`:

* Refs to the breadcrumbs partial.
* Refs to debug-toggle.
* General mentions of shortcodes/components.

Cleaned out from `Readme.md`.

---

Let me know when you're ready to move on — or if you want to split off the debug-toggle docs into their own file instead.
