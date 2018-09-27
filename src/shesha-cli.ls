Shesha = require \./shesha
fs = require \fs

# assume arguments are json files with keys at the top level
# how to say whether ot use deck or die? 
args = process.argv.slice 2

mode = \template

gen = new Shesha.Generator!

read-source-data = ->
  JSON.parse fs.read-file-sync it, \utf-8

USAGE = """
Usage: ./shesha [template] [-c cards.json ...] [-d dice.json ...] [-t template.shesha]

Generate random sentences based on templates.

    -c         use json file as list of decks
    -d         use json file as dice
    -t         use file as shesha language template
    template   template to render

JSON input files should contain an object with keys that map to lists. Nested
objects are not supported.

All arguments are optional, though you'll probably want a template or template
file.
"""

mode = \TEXT
NUM = 1
while args.length > 0
  arg = args.shift!
  switch arg
  | \-h, \--help =>
    console.log USAGE
    process.exit 0
  | \-n => NUM = +args.shift!
  | \-c => # cards
    mode = \CARDS
  | \-d => # die
    mode = \DICE
  | \-t => # template language
    mode = \TEMPLATE
  | otherwise =>
    switch mode
    | \TEXT => TEXT = arg
    | \CARDS =>
      for key, val of read-source-data arg
        gen.add-deck key, val
    | \DICE =>
      for key, val of read-source-data arg
        gen.add-die key, val
    | \TEMPLATE =>
      gen.read-generator fs.read-file-sync arg, \utf-8

if TEXT
  for ii from 0 til NUM
    console.log gen.render TEXT
