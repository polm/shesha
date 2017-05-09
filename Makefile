all: index.js

random.js: random.ls
	lsc -c -o . random.ls

shesha.js: shesha.ls
	lsc -c -o . shesha.ls

index.js: shesha.js
	browserify shesha.js > index.js
