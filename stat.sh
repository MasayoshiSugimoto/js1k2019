#!/bin/bash

node node_modules/uglify-es/bin/uglifyjs\
	--compress\
	--mangle\
	--mangle-props\
	-- ParticleSystem.js\
	| tr '()=,:;.' '\n'\
	| awk '
		{
			map[$0]++
		}

		END{
			for (key in map) {
				print map[key]" "key
			}
		}
	'\
	| sort -n -k1

