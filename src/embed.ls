Generator = require(\./shesha).Generator

for el in document.query-selector-all \.shesha-widget
  el.class-list.remove \shesha-widget # prevent double processing
  gen = new Generator!
  widget-container = document.create-element \div
  widget-container.style.max-width = \800px
  el.parent-node.insert-before widget-container, el.next-sibling

  gen.read-generator el.text-content
  gen.make-widget widget-container
