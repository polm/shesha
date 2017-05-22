all: embed.js editor.js lib/shesha-cli.js

lib/shesha.js: src/shesha.ls
	lsc -c -o lib/ src/shesha.ls

lib/shesha-cli.js: src/shesha-cli.ls lib/shesha.js
	lsc -c -o lib/ src/shesha-cli.ls

embed.js: src/embed.ls lib/shesha.js
	lsc -c -o lib/ src/embed.ls 
	browserify lib/embed.js > embed.js

editor.js: src/editor.ls lib/shesha.js
	lsc -c -o lib src/editor.ls 
	browserify lib/editor.js > editor.js
