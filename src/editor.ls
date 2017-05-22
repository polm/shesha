Generator = require(\./shesha).Generator

textarea = document.query-selector 'textarea'

textarea.onkeyup = ->
  gen = Generator!
  try
    gen.read-generator textarea.value
    gen.make-widget document.query-selector \.shesha-widget
  catch e
    console.log e

textarea.onkeyup!

copy = document.query-selector \#copy

copy.onclick = ->
  # blank lines are replaced with a single underscore to keep markdown parsers happy
  dummy = document.query-selector \#dummy
  dummy.value = '<script type="text/plain" class="shesha-widget">\n' + textarea.value + '\n</script>\n'
  dummy.value += '<script src="https://rawgit.com/polm/shesha/master/embed.js"></script>'
  dummy.select!
  document.exec-command \Copy
