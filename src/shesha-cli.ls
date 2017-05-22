Shesha = require \./shesha
fs = require \fs

# assume arguments are json files with keys at the top level
# how to say whether ot use deck or die? 
args = process.argv.slice 2

mode = \template

gen = new Shesha.Generator!

read-source-data = ->
  fname = args.shift!
  JSON.parse fs.read-file-sync fname, \utf-8

while args.length > 0
  arg = args.shift!
  switch arg
  | \-c => # cards
    for key, val of read-source-data!
      gen.add-deck key, val
  | \-d => # die
    for key, val of read-source-data!
      gen.add-die key, val
  | otherwise =>
    console.log gen.render arg
