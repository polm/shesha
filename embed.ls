Generator = require(\./shesha).Generator

for el in document.query-selector-all \.shesha-widget
  gen = new Generator!
  gen.read-generator el.text-content
  gen.make-widget el
