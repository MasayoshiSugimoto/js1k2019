#!/bin/bash

cat js1k.html | sed '
	/<!\[CDATA\[demo\]\]>/ {
		r ParticleSystem.js
		d
	}
' > js1k.out.html
echo "File size: $(stat -f'%-z' ParticleSystem.js)"
