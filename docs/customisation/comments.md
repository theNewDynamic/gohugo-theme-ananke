---
title: Comments
date: 2026-01-16T08:00:00.000+0700
---

Ananke currently supports two commenting systems: Disqus and [Commento](https://commento.io/).

## Disqus

Using [Disqus](https://disqus.com/) as a comment system for your website is an internal feature of Hugo. For more information see the official [Hugo documentation](http://gohugo.io/content-management/comments/). 

```toml
[services.disqus]
shortname = 'YOURSHORTNAME'
```

Note that the setup for Disqus is _NOT_ done inside of the `params` section, but with in the `services` section of your config file. To turn off Disqus, remove, or comment out the preceding lines.

## Commento.io

```toml
[params]
commentoEnable = true
# if you use a selfhosted version of commento, uncomment the next line and set your path
# commentoPath = "https://commento.io/YOURPATH" 
```

By default it uses the public Commento instance at `https://commento.io`. If you are using a [self-hosted version of Commento](https://docs.commento.io/installation/self-hosting/), uncomment the `commentoPath` line and set it to your Commento instance URL.
