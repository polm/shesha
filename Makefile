all: embed.js editor.js random.js

shesha.js: shesha.ls
	lsc -c -o . shesha.ls

embed.js: embed.ls shesha.js
	lsc -c -o . embed.ls 
	browserify embed.js > embed.browser.js
	mv embed.browser.js embed.js

editor.js: editor.ls shesha.js
	lsc -c -o . editor.ls 
	browserify editor.js > editor.browser.js
	mv editor.browser.js editor.js
