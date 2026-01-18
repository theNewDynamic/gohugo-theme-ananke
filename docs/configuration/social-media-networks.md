---
title: Social Media Networks
date: 2026-01-16T08:00:00.000+0700
---

Ananke automatically adds "follow" link icons to the header and footer and "Share" link icons to pages unless the `disable_share` parameter is set to true either on the site level (site params) or page level (front matter). Each services can show a label, an icon, and be formatted in a custom color.

> MIGRATION: Read about how to migrate below in the Section [Migrate from versions before v2.11](https://github.com/theNewDynamic/gohugo-theme-ananke/wiki/Social-media-network-setup#migrate-from-versions-before-v211)

## Configuration

All configuration of Ananke's social media features is located under the `ananke.social` section in your websites `params` section. This can be found at one of the following locations:

* in `hugo.toml` or `config.toml` in your website root under `params.ananke.social`
* in `config/_default/hugo.toml` or `config/_default/config.toml` under `params.ananke.social`
* in `config/_default/params.toml` under `ananke.social` or
* in `config/$ENVIRONMENTNAME/*` --- you know what you are doing

All samples in this documentation will refer to configuration in `config/_default/params.toml` and use the TOML format. If you have problems translating that into your configuration situation and format (JSON, YAML) [please join us in the Discussion Forum](https://github.com/theNewDynamic/gohugo-theme-ananke/discussions).

* `ananke.social.share` configures share buttons/links on single pages/posts
* `ananke.social.follow` configures social network links in "follow us on social media" widgets
* `ananke.social.networks` configures single networks. if user wants to extend, they add a new item to their local param section
* `ananke.social.$slugname` is individual configuration for the networks defined in `ananke.social.networks` that is to be set for the implementing site in the individual configuration

### Configure social media follow links

#### Set up global options

You can setup the display of your follow links with these options:

```toml
[ananke.social.follow]
new_window_icon = false
networks = [
  "facebook",
  "bluesky",
  "linkedin"
]
```

* `new_window_icon` (default is `false`): add a small indicator of an outgoing link to the icon if this is set to `true`.
* `networks` (required, no default): a list of `slug` parameters of the networks you wish to link to. You can either choose one or more of [the included pre-configured networks](https://github.com/theNewDynamic/gohugo-theme-ananke/wiki/Social-media-network-setup#available-networks) or [configure your own networks](https://github.com/theNewDynamic/gohugo-theme-ananke/wiki/Social-media-network-setup#setup-individual-new-networks).

#### Set your profile or user name

In the simplest case, add a slug for the network, and below that, add your username in that network:

```toml
[params.ananke.social.linkedin]
username = "patrickkollitsch"
```

The theme will then create a profile link without intervention.

#### Override the profile link

If you wish to override the profile link for the follow link then set the parameter `profilelink`:

```toml
[params.ananke.social.linkedin]
username = "patrickkollitsch"
profilelink = "https://th.linkedin.com/in/patrickkollitsch/"
```

Setting the username in that case might make sense if you want to use the username with the share link (for instance in networks that link to your user profile).

#### Override the label of the social network

Each social network is already set up with a proper label. If the user wishes to override the profiles network name they can do this via the label attribute:

```toml
[params.ananke.social.linkedin]
label = "Linked In"
```

This will override the globally set up label.

#### `rel` attributes on follow links

All social follow links use by default the attribute `rel="noopener"` to keep the privacy of people clicking on it. In some cases you wish to add other items to these links (like `me` to verify your ownership of the social media profile or your website). In that case you may add a `rel` parameter to this setup:

```toml
[params.ananke.social.linkedin]
username = "patrickkollitsch"
profilelink = "https://th.linkedin.com/in/patrickkollitsch/"
rel = "me"
```

Having multiple `rel` parameter separated by space is valid usage of this attribute. This will be extended by the noopener attribute in any case.

### Configure social media share links

#### Set up sharing networks

Setup sharing  the `ananke.social.share` section:

```toml
[ananke.social.share]
icons = true
sharetext = true
networks = [
  "email",
  "facebook",
  "bluesky",
  "linkedin"
]
```

* networks (required): To set your preferred networks and their order you define them in the `networks` parameter
* icons (optional, default `true`): show icons for each network
* sharetext (optional, default `false`): show share text for each network

#### Disable sharing partially or globally

By default sharing links on each single page are enabled. To disable this behaviour set `disable_share` in your pages front matter to `true`:

```yaml
---
disable_share: true
---
```

You can disable this feature completely by setting `ananke.social.share.disable_share` to `true` in your configuration:

```toml
[ananke.social.share]
disable_share: true
```

### Setup individual new networks

> [NOTE]
> The information in this section is for developer that want to extend the capabilities of Ananke above the pre-configured networks. Ignore this if you work only with the available networks.

It is fairly easy to extend the pre-configured networks with the following setup (for example for LinkedIn, which is already pre-configured):

```toml
[ananke.social.linkedin]
username = "patrick.kollitsch"

[ananke.social.networks.linkedin]
slug = "linkedin"
label = "LinkedIn"
color = "#0077b5"
profile = "http://linkedin.com/in/%s"
icon = "linkedin" # font awesome brand icon name
link = "https://www.linkedin.com/shareArticle"
#separator = "&"
[ananke.social.networks.linkedin.particles]
url = "permalink"
title = "title"
summary = "description"
source = "permalink"
params = "mini=true"
```

Every new network requires an entry in the `[ananke.social.networks.$NETWORK_SLUG]` table. The entries below that can be:

* slug (required): lower case alphanumerical string naming the network. use the networks name. if you want to add two profiles for one single network, you can achieve that by adding a slug like `linkedin2` and configure the profile in your local config with this slug.
* label (required): Title of the network (will be printed out in strings)
* color (optional): Color for the icon of this network
* profile (required): Either false, to disable the listing of this network in the follow section, or a string containing the link to the network profile. A `%s` marks the place that will be replaced with the users set up `username` under `ananke.social.$SLUGNAME` (in our case `ananke.social.linkedin`).
* icon (required): icon name under `assets/ananke/socials/` without `.svg`. The icon is part of [Fontawesome Brand Icons](https://fontawesome.com/search?o=r&f=brands) and you can find it more convenient on their page.
* share (optional, default is `true`): marks if this network functionality.
* link (required, if `share` is `true`): The start of the share link for this network

Then in `ananke.social.networks.$NETWORK_SLUG.particles` you can add as much as required parts that will be rendered as parameters in the share URL. The format for this system is this:

```toml
[ananke.social.networks.$NETWORK_SLUG.particles]
url = "permalink"
title = "title"
summary = "description"
source = "permalink"
params = "mini=true"
```

This will result in the following share link:

```plaintext
https://www.linkedin.com/shareArticle?url=%PERMALINK&title=%TITLE&summary=%DESCRIPTION&source=%PERMALINK&mini=true
```

Long story short: on the the label on the left is included as is, followed by `=` and the replaced value of the setting you name in the particle. This works pretty much like the page variables in GoHugo:

* `permalink` is replaced with the permalink of the page (urlencoded)
* `title` is replaced with the title of the page (urlencoded)
* `description` is replaced with the frontmatter description
* `username` is replaced with the configured `username` for that network (under the `ananke.social.$NETWORKSLUG` section)

Adding to that everything in `params` is added blindly to the resulting link.

This way you can create a share for nearly any network.

I am writing "nearly" because some networks do not like adding parameters the "normal" way. This is where the `separator` parameter comes into play:

```toml
separator = ";"
```

Using this parameter in the configuration above would result in our example URL looking like this:

```plaintext
https://www.linkedin.com/shareArticle?url=%PERMALINK;title=%TITLE;summary=%DESCRIPTION;source=%PERMALINK;mini=true
```

To override any of the existing networks add the **full** configuration row (including it's particles) into your local configuration and override the values you want to change.

To override the icon for a network add your own copy to your local `assets/ananke/socials/` directory.

## Available networks

This is a list of slugs for already configured networks in the theme. You can add missing networks without much hassle (see [Configure social media follow links](https://github.com/theNewDynamic/gohugo-theme-ananke/wiki/Social-media-network-setup#configure-social-media-follow-links)). If you experience issue doing that [feel free to reach out in our Forum](https://github.com/theNewDynamic/gohugo-theme-ananke/discussions).

| Slug          | profile | share | Notes                                                                                                  |
| ------------- | :-----: | :---: | ------------------------------------------------------------------------------------------------------ |
| bluesky       |    ✅    |   ✅   | Read notes about [configuring networks with multiple hosts](#configuring-networks-with-multiple-hosts) |
| email         |    ❌    |   ✅   |                                                                                                        |
| facebook      |    ✅    |   ✅   |                                                                                                        |
| github        |    ✅    |   ❌   |                                                                                                        |
| gitlab        |    ✅    |   ❌   |                                                                                                        |
| hackernews    |    ✅    |   ✅   |                                                                                                        |
| instagram     |    ✅    |   ❔   |                                                                                                        |
| keybase       |    ✅    |   ❌   |                                                                                                        |
| linkedin      |    ✅    |   ✅   |                                                                                                        |
| medium        |    ✅    |   ❔   |                                                                                                        |
| mastodon      |    ✅    |   ❌   | Read notes about [configuring networks with multiple hosts](#configuring-networks-with-multiple-hosts) |
| pinterest     |    ✅    |   ✅   |                                                                                                        |
| reddit        |    ✅    |   ✅   |                                                                                                        |
| rss           |    ✅    |   ❌   | add `profilelink` to link to your RSS feed                                                             |
| slack         |    ✅    |   ❔   | add `profilelink` to your slack channel                                                                |
| stackoverflow |    ✅    |   ❌   | your `username` is your profile's ID                                                                   |
| telegram      |    ✅    |   ✅   |                                                                                                        |
| tiktok        |    ✅    |   ✅   |                                                                                                        |
| tumblr        |    ✅    |   ✅   |                                                                                                        |
| twitter       |    ✅    |   ✅   |                                                                                                        |
| whatsapp      |    ❌    |   ✅   |                                                                                                        |
| xing          |    ✅    |   ✅   |                                                                                                        |
| x-twitter     |    ✅    |   ✅   |                                                                                                        |
| youtube       |    ✅    |   ❔   |                                                                                                        |

Legend:
✅ --- feature configured
❌ --- feature not configured and not available
❔ --- feature not configured, but might be available

---

## Migrate from versions before v2.11

Take your existing configuration under `params.ananke_social` and apply them to the new structure under `params.ananke.social` (note that `ananke` and `social` are two subsections now, not one combined label).

Follow the instructions under [Configure social media follow links](https://github.com/theNewDynamic/gohugo-theme-ananke/wiki/Social-media-network-setup#configure-social-media-follow-links) to configure your social media links.

`params.ananke_social` (the *old* configuration with the underscore) can then be removed from your configuration.

TLDR:

**Old config:**

```toml
[[ananke_socials]]
name = "twitter"
url = "https://twitter.com/theNewDynamic"
```

**New config:**

```toml
[[ananke.social.twitter]]
username = "theNewDynamic"
profilelink = "https://twitter.com/theNewDynamic" # (optional, this would be covered by the username above)
```

### Development changes

* all functions in `partial/func/socials` are removed
* If you were using the following partials anywhere:

  ```go-html-template
  {{ partial "social-follow.html" . }}
  {{ partial "social-share.html" . }}
  ```

  you should be able to replace the functionality with this change

  ```go-html-template
  {{ partial "social/follow.html" . }}
  {{ partial "social/share.html" . }}
  ```

## Notes

### Font Awesome

This project uses Font Awesome brand icons, which are licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://github.com/FortAwesome/Font-Awesome/blob/6.x/LICENSE.txt). For more information, visit [Font Awesome](https://fontawesome.com/).

### Customize Icons

This theme comes with Font Awesome brand icons. If you wish to use your own icon set you can override all icons by copying them into your own repository under `assets/ananke/socials`. Icons need to be in the SVG format with a `.svg` extension. Their name needs to match the `slug` parameter in the `ananke.social.networks` setup for the selected network.

### Configuring networks with multiple hosts

Due to the nature of Mastodon and Bluesky instances there is no way to configure all networks without too much noise. Configuration, for now, requires a `profilelink` parameter with the full URL to your profile. `username` can be ignored in that case.
