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
  dummy = document.query-selector \#dummy
  dummy.value = '<div class="shesha-widget" style="opacity:0;max-width:800px">' + textarea.value + '</div>'
  dummy.value += '<script src="https://rawgit.com/polm/shesha/master/embed.js"></script>'
  dummy.select!
  document.exec-command \Copy
