R = -> ~~(it * Math.random!)
pick = -> it[R it.length]

roll = (num=1, sides=6, bonus=0) ->
    if num < 1 then num = 1
    res = bonus
    for ii from 0 til num
      res += 1 + R sides
    return res

choose = ->
  template = Array.prototype.join.call arguments, ' '
  # this is short anonymous tables inside templates
  # ex:
  # print You see a [!c /fighter/wizard/rogue/]
  delim = template[0]
  choices = template.split(delim).filter -> it
  return pick choices

deck = (items) ->
  items = items.slice 0 # don't modify the argument
  orig = items.slice 0 # save a copy
  res = ->
    index = R items.length
    out = items[index]
    items.splice index, 1
    return out
  res.reset = ~>
    items := orig.slice 0
  return res

fade-in = (el) ->
  opacity = 0
  fade-in-h = ->
    opacity += 1
    el.style.opacity = opacity / 100
    if opacity >= 100
      return

    set-timeout fade-in-h, 1
  fade-in-h!

snake2camel = ->
  return it.0 + it.split('-')
    .map -> it.0.to-upper-case! + it.slice 1
    .join ''
    .slice 1

class Generator

  ~>
    @sources = {}
    @special =
      r: roll
      c: choose

  add-deck: (name, items) ~>
    @sources[name] = deck items

  add-die: (name, items) ~>
    @sources[name] = -> pick items

  exec: (line) ->
    words = line.split ' '
    funcname = snake2camel words.shift!

    # per-function cleanup
    if funcname == \print then words = [words.join ' ']
    if funcname == \roll then words = words.map -> +it

    this[funcname].apply this, words


  render: (template, inner=false) ~>
    out = ''
    ci = 0
    while ci < template.length and template[ci] != \]
      if template[ci] == '['
        [step, key] = @render template.substr(ci + 1), true
        ci += 2 + step
        #TODO syntax for rolling etc.
        if key[0] == \!
          key = key.substr 1
          words = key.split ' '
          cmd = words.shift!
          out += @special[cmd].apply this, words
        else
          out += @render @sources[key]!
        continue

      out += template[ci]
      ci++
    if inner
      return [ci, out]
    return out

  set-generator: ~>
    @genfunc = it

  read-terms: (lines, li) ~>
    terms = []
    while true
      li++
      line = lines[li]?.trim!
      if not line then return terms
      terms.push line

  read-generator: ~>
    lines = it.split '\n'
    li = 0
    while li < lines.length
      line = lines[li].trim!

      if line.0 == \#
        li++
        continue

      words = line.split ' '
      command = words.shift!

      if command == \die
        name = words.join ' '
        terms = @read-terms(lines, li)
        @add-die name, terms
        li += 1 + terms.length
        continue

      if command == \deck
        name = words.join ' '
        terms = @read-terms(lines, li)
        @add-deck name, terms
        li += 1 + terms.length
        continue

      if command == \generator
        commands = @read-terms lines, li

        exec = @exec

        @set-generator ->
          for command in commands
            exec.apply this, [command]
        li += 1 + commands.length
        continue

      li++

  make-widget: (sel='.shesha-widget') ~>
    el = document.query-selector sel
    wr = new WidgetRenderer this, el

    wr.set-generator @genfunc

    wr.generate!

    el.onclick = wr.generate


class WidgetRenderer
  (@gen, @el) ~>
    @sources = @gen.sources
    @vert = false

  make-div: ~>
    div = document.create-element \div
    div.style.height = \100%
    div.style.flex = 1
    div.style.border = "1px solid black"
    @row-el.append-child div
    return div

  make-vert-div: ~>
    div = document.create-element \div
    div.style.width = \100%
    div.style.float = \left
    div.style.border = "1px solid black"
    parent = @row-el.children[*-1]
    parent.append-child div
    percent = (100 / parent.children.length) + \%
    for cell in parent.children
      cell.style.height = percent
    return div

  new-row: ~>
    @row-el = document.create-element \div
    @row-el.class-list.add \row
    @row-el.style.width = \100%
    @row-el.style.height = \50px
    @row-el.style.display = \flex
    @row-el.style.flex = 1
    @el.append-child @row-el

  print: (template, vert=false) ~>
    out = @gen.render template
    divmaker = ((@vert or vert) and @make-vert-div) or @make-div
    div = divmaker!
    div.style.text-align = \center
    div.style.padding = \10px
    div.innerHTML = out
    div.style.fontSize = \20px
    div.style.display = \flex
    div.style.align-items = \center
    div.style.justify-content = \center

  image: (template) ~>
    rendered = @gen.render template
    words = rendered.split ' '
    src = words.shift!
    caption = words.join ' '
    div = @make-div!
    div.style.display = \flex
    div.style.flex-direction = \column
    @row-el.style.height = \300px
    div.style.height = \100%
    img = new Image!
    img-holder = @make-vert-div!
    if caption
      @print caption, true
    img-holder.style.flex-grow = 1
    img-holder.style.backgroundSize = \cover
    img-holder.style.backgroundPosition = "center center"

    img.onload = ->
      img-holder.style.backgroundImage = "url(#src)"
    img.src = src

  nest: ~>
    @parents = @parents or []
    @parents.push @el
    @row-els = @row-els or []
    @row-els.push @row-el
    new-parent = @make-div!
    new-parent.style.flex-direction = \column
    new-parent.style.display = \flex
    @el = new-parent
    @new-row!

  end-nest: ~>
    @el = @parents.pop!
    @row-el = @row-els.pop!

  start-column: ~>
    @oldvert = @vert
    col = @make-div!
    col.style.height = \100%
    @vert = true

  end-column: ~>
    @vert = @oldvert


  style: (key, val) ~>
    @row-el.style[key] = val

  col-widths: (...widths) ~>
    cols = @row-el.children
    for ci from 0 til cols.length
      share = widths[*-1]
      if ci < widths.length
        share = widths[ci]

      cols[ci].style.flex = share

  set-generator: ~> @genfunc = it

  roll: ~>
    @print (roll.apply this, arguments).to-string!

  generate: ~>
    for source of @sources
      @sources[source].reset?! # reset decks as needed

    @el.innerHTML = '' # reset insides
    @el.style.opacity = 0
    @new-row!
    @genfunc! # actually fill stuff
    fade-in @el

textarea = document.query-selector 'textarea'

textarea.onkeyup = ->
  gen = new Generator!
  try
    gen.read-generator textarea.value
    gen.make-widget \#carousel
  catch e
    console.log e

textarea.onkeyup!
