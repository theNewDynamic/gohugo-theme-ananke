+++
title =  "{{ replace .TranslationBaseName "-" " " | title }}"
date = {{ .Date }}
tags = []
featured_image = ""
description = ""
+++

+++
slug: {{ substr (md5 (printf "%s%s" .Date (replace .TranslationBaseName "-" " " | title))) 4 8 }}
+++