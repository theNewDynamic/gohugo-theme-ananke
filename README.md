# A personal set of tweaks to make a dark Ananke

> [!Note]
> This was just made as a way to tweak Ananke for a dark mode, and track upstream.
> There are likely bits of the theme that still uses the wrong colors

## Installation

I tried to stick as much as possible to base Ananke, only editing the files with hard coded css colors. Install Ananke as normal, then simply copy these into the hugo site file structure and hugo will use these before the installed version of Ananke.

The edited files so far;
* layouts/_default/list.html
* layouts/_default/summary.html

### The config file

Change/add these stock Ananke params to get the bulk of dark mode-ing done

```toml
[params]
  body_classes = "avenir bg-near-black silver"
  post_content_classes = "bg-dark-gray"
  text_color = "near-white"
```

Add these extra params to control post list colors in the edited files;

```toml
[params]
  list_dark_bg = "bg-dark-gray"
  summary_dark_bg = "bg-dark-gray"
  summary_more_bg = "bg-dark-gray"
  summary_more_hover = "hover-bg-light-gray hover-near-black"
```

These examples still use the [Tachyons](https://tachyons.io/docs/themes/skins/) library. Just as with the rest of Ananke,  site, choose a color and preface it with "bg-"

You can find a list of available typefaces [here](https://github.com/tachyons-css/tachyons/blob/v4.7.0/src/_font-family.css).

And a list of background colors [here](https://github.com/tachyons-css/tachyons/blob/v4.7.0/src/_skins.css#L96).
