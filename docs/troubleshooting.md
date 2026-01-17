---
title: Troubleshooting
date: 2026-01-16T08:00:00.000+0700
---

## Sorry, but "$FEATURE does not work" doesn't work for us

Long story short, ask yourself: If you start bleeding out of all your orifices, will you tell the doctor "Doctor please help, I am quite new to this whole health thing and know you will laugh about me but I suddenly started bleeding out of all my orifices."? Or will you tell the doctor "Doctor, after ingesting a couple of razor blades I suddenly started bleeding. The razor blades were quite sharp. Can you help me?"

In open source communities like ours reporting issues clearly helps everyone. A message like *"the homepage doesn’t work"* might feel like a good starting point, but without more detail, it leaves us guessing. Some problems come from Hugo itself, others from the Ananke theme, or even from how it's configured - so the more info you share, the faster we can figure it out together.

When reporting a bug or asking for help, please include:
* **Versions**: your Hugo version, the version of the Ananke theme (and how you installed it), and your operating system.
* **Configuration**: your full `hugo.toml` or `hugo.yaml` file or configuration folder, plus any relevant folder structure or module settings. Note that this can be `hugo.ext`, `config.ext`, or even a full folder `config` with several sub levels. Hugo is flexible.
* **Steps**: what you were trying to do, what you expected to happen, and what actually happened instead.
* **Output**: the full error messages from the command line—don’t just paste the last line.
* **Extras**: logs, browser details (for visual issues), screenshots are very much appreciated and help to put words into visual or, if something looks wrong, make that clear - anything that might help us reproduce the problem.

The more complete the picture, the more likely it is that someone in the community will jump in and help quickly. You're not just helping yourself—you’re making the project better for everyone.
