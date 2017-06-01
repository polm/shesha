Generator = require(\./shesha).Generator
require 'codemirror/addon/mode/simple'
CodeMirror = require \codemirror
Split = require \split.js

CodeMirror.define-simple-mode \shesha, {
  start: [
    {regex: /\#.*/, token: \comment}
    {regex: /(deck)(\s+)(.*)/, token: [\keyword, null, \variable-2], next: \block, sol: true}
    {regex: /(die)(\s+)(.*)/, token: [\keyword, null, \variable-2], next: \block, sol: true}
    {regex: /generator/, token: \keyword, next: \generator, sol: true}
  ]
  block: [
    {regex: /\#.*/, token: \comment}
  ]
  generator: [
    {regex: /\#.*/, token: \comment}
    {regex: /([^ ]+)\s/, sol: true, token: \atom}
    {regex: /\[/, push: \bracket}
  ]
  bracket: [
    {regex: /\[/, push: \bracket}
    {regex: /[^\]]+/, token: \string}
    {regex: /\]/, pop: true}
  ]
  meta: {
    lineComment: \# # doesn't seem to do anything?
    blankLine: ->
      it.state = \start
  }
}

split = Split [\#editor, \#field],
  sizes: [60, 40]
  gutterSize: 10
  minSize: [100, 520]
  elementStyle: (dim, size, gutsize) ->
    'flex-basis': "calc(#size% - #{gutsize}px"
  gutterStyle: (dim, gutsize) ->
    'flex-basis': gutsize + \px
    border-right: '10px groove #ddd'

textarea = document.query-selector 'textarea'
codemirror = CodeMirror.from-text-area textarea,
  line-wrapping: true
  line-numbers: false
  mode: \shesha
  theme: \paraiso-dark

update-generator = ->
  gen = Generator!
  try
    gen.read-generator codemirror.get-value!
    gen.make-widget document.query-selector \.shesha-widget
  catch e
    console.log e

codemirror.on \change, update-generator
update-generator!

copy = document.query-selector \#copy

copy.onclick = ->
  # blank lines are replaced with a single underscore to keep markdown parsers happy
  dummy = document.query-selector \#dummy
  dummy.value = '<script type="text/plain" class="shesha-widget">\n' + codemirror.get-value! + '\n</script>\n'
  dummy.value += '<script async src="https://rawgit.com/polm/shesha/master/embed.js"></script>'
  dummy.select!
  document.exec-command \Copy
