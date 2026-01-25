---
title: Calculate and show reading time
date: 2026-01-16T08:00:00.000+0700
---

The reading time displayed in `layouts/_default/single.html` can now be configured via a `reading_speed` parameter, instead of always using Hugo's computed `.ReadingTime`. ([GitHub][1])

* The theme still only shows reading time when `show_reading_time = true` is enabled (page param or section param). ([GitHub][1])
* The displayed value is now computed like this:

  * Default (no config): use Hugo's `.ReadingTime` as before. ([GitHub][1])
  * With config: compute reading time as `ceil(WordCount / .Site.Params.reading_speed)` and pass the resulting integer into the existing `readingTime` i18n string. ([GitHub][1])
* This follows the approach described in GoHugo's `ReadingTime` documentation, including the multilingual use case. ([gohugo.io][2])

## Configuration

You can set `reading_speed` globally or per language. In multilingual sites, the recommended approach is language-specific `params.reading_speed`. ([gohugo.io][2])

```toml
[languages]
  [languages.en.params]
    reading_speed = 228
  [languages.de.params]
    reading_speed = 179
```

## Notes

* GoHugo's default assumption is 212 words per minute (and 500 for CJK languages) when using `.ReadingTime`; setting `reading_speed` lets you align the displayed value with your own targets per language. ([gohugo.io][2])
* PR #801 proposed this feature for language params; the final implementation landed via commit `39e2145` (referencing #801) and applies the `reading_speed` override through `.Site.Params.reading_speed`. ([GitHub][3])

[1]: https://github.com/theNewDynamic/gohugo-theme-ananke/commit/39e2145985954eac07dd343a456f5696c8f9e9d6 "theme(fix): add configurability to reading time display · theNewDynamic/gohugo-theme-ananke@39e2145 · GitHub"
[2]: https://gohugo.io/methods/page/readingtime/ "ReadingTime"
[3]: https://github.com/theNewDynamic/gohugo-theme-ananke/pull/801 "Support reading_speed language param in single.html by D14rn · Pull Request #801 · theNewDynamic/gohugo-theme-ananke · GitHub"
