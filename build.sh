#!/bin/bash

readonly outputFile=index.html
cat $outputFile | sed '
	/<!\[CDATA\[demo\]\]>/ {
		r ParticleSystem.js
		d
	}
' > $outputFile
echo "File size: $(stat -f'%-z' ParticleSystem.js)"
