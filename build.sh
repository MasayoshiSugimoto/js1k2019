#!/bin/bash

cat js1k.html | sed '
	/<!\[CDATA\[demo\]\]>/ {
		r ParticleSystem.js
		d
	}
' > index.html
echo "File size: $(stat -f'%-z' ParticleSystem.js)"
