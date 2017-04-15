---
author: adamchlan
categories:
- Uncategorized
date: 2012-01-07T14:07:21Z
original_post_id:
- "1241"
tags:
- sticky
- template
title: 'Template: Sticky'
parent: "Variables"
url: /2012/01/07/template-sticky/
---

This is a sticky post.

There are a few things to verify:

  * The sticky post should be distinctly recognizable in some way in comparison to normal posts. You can style the `.sticky` class if you are using the <a title="WordPress Codex post_class() Function" href="http://codex.wordpress.org/Function_Reference/post_class" target="_blank">post_class()</a> function to generate your post classes, which is a best practice.
  * They should show at the very top of the blog index page, even though they could be several posts back chronologically.
  * They should still show up again in their chronologically correct postion in time, but without the sticky indicator.
  * If you have a plugin or widget that lists popular posts or comments, make sure that this sticky post is not always at the top of those lists unless it really is popular.