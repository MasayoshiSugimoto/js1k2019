#!/bin/bash

node node_modules/uglify-es/bin/uglifyjs\
	--compress\
	--mangle\
	--mangle-props\
	-- ParticleSystem.js > ParticleSystem.out.js

cat js1k.html\
	| sed '
		/<!\[CDATA\[demo\]\]>/ {
			r ParticleSystem.out.js
			d
		}
	' > index.html
echo "File size: $(stat -f'%-z' ParticleSystem.out.js)"
