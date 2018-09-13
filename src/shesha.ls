articlize = require(\articles).articlize

indefinite = (word, ...rest) ->
  return ([articlize word].concat rest).join ' '

R = -> ~~(it * Math.random!)
pick = -> it[R it.length]

error-output = ->
  return "<span style=\"color:red\">" + it + "</span>"

roll = (num=1, sides=6, bonus=0) ->
    # cast everything
    num = +num
    sides = +sides
    bonus = +bonus

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

uppercase = -> it.0.to-upper-case! + it.slice 1

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
  el.style.opacity = 0
  if not el.animate
    # this is an issue for Edge and Safari
    # http://caniuse.com/#feat=web-animation
    el.style.opacity = 1
    return
  ani = el.animate {opacity: [0, 1]}, {duration: 100, easing: \ease-in}
  ani.onfinish = -> el.style.opacity = 1

snake2camel = ->
  return it.0 + it.split('-')
    .map -> it.0.to-upper-case! + it.slice 1
    .join ''
    .slice 1

export class Generator
  ~>
    @sources = {}
    @sources-raw = {}
    @special =
      r: roll
      c: choose
      u: uppercase
      a: indefinite
      A: -> uppercase indefinite it

  add-deck: (name, items) ~>
    base = items.slice 0
    if @sources-raw[name]
      base = base.concat @sources-raw[name]
    @sources-raw[name] = base
    @sources[name] = deck @sources-raw[name]

  add-die: (name, items) ~>
    base = items.slice 0
    if @sources-raw[name]
      base = base.concat @sources-raw[name]
    @sources-raw[name] = base
    @sources[name] = ~> pick @sources-raw[name]
    return @sources[name]

  clear: (name) ~>
    delete @sources[name]
    delete @sources-raw[name]

  exec: (line) ->
    words = line.split ' '
    funcname = snake2camel words.shift!

    # per-function cleanup
    if funcname == \print then words = [words.join ' ']
    if funcname == \image then words = [words.join ' ']
    if funcname == \roll then words = words.map -> +it

    this[funcname].apply this, words

  reset: ~>
    for source of @sources
      @sources[source].reset?! # reset decks as needed

  render: (template, inner=false, stack=[]) ~>
    out = ''
    ci = 0
    while ci < template.length and template[ci] != \]
      if template[ci] == '['
        [step, key] = @render template.substr(ci + 1), true
        ci += 2 + step
        if key[0] == \!
          key = key.substr 1
          words = @render(key).split ' '
          cmd = words.shift!
          if @special[cmd]
            out += @special[cmd].apply this, words
          else
            out += error-output "ERROR: no such special command: #cmd"
        else
          if -1 < stack.index-of key
            out += error-output "ERROR: loop detected on key: #key"
            continue

          if @sources[key]
            out += @render @sources[key]!, false, stack.concat key
          else
            out += error-output "ERROR: no such source: #key"
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

  make-widget: (el) ~>
    wr = new WidgetRenderer this, el

    wr.set-generator @genfunc
    wr.generate!
    reroll = document.create-element \button
    reroll.style['max-width'] = \800px
    reroll.style.width = \100%
    reroll.style.padding = \0.5em
    reroll.innerHTML = "Click to regenerate"
    reroll.onclick = wr.generate
    el.parent-node.insert-before reroll, el

class WidgetRenderer
  (@gen, @el) ~>
    @load-count = 0
    @root = @el
    @sources = @gen.sources

  save: (key, ...words) ~>
    # this is used to save values during a run
    # it's faked using a die with one side
    template = words.join ' '
    @gen.clear key
    @gen.add-die key, [@gen.render template]

  make-div: (parent=@row-el) ~>
    div = document.create-element \div
    div.style.flex = 1
    div.style.border = "1px solid black"

    div.style.text-align = \center
    div.style.padding = \10px
    div.style.fontSize = \20px
    div.style.display = \flex
    div.style.align-items = \center
    div.style.justify-content = \center

    parent.append-child div
    return div

  new-row: ~>
    @row-el = document.create-element \div
    @row-el.class-list.add \row
    @row-el.style.width = \100%
    @row-el.style.display = \flex
    @row-el.style.flex = 1
    @el.append-child @row-el

  print: (template) ~>
    out = @gen.render template
    div = @make-div!
    div.innerHTML = out

  image: (template) ~>
    rendered = @gen.render template
    words = rendered.split ' '
    src = words.shift!
    caption = words.join ' '

    div = @make-div!
    div.style.display = \flex
    div.style.flex-direction = \column
    div.style.padding = 0
    @row-el.style.height = \300px
    div.style.height = \100%
    img = new Image!
    img-holder = document.create-element \div
    img-holder.style.flex-grow = 1
    img-holder.style.flex = 6
    img-holder.style.backgroundSize = \cover
    img-holder.style.backgroundPosition = "center center"
    img-holder.style.width = \100%

    if caption
      @row-el.style.height = \350px
      cdiv = @make-div div
      cdiv.style.width = \100%
      cdiv.innerHTML = caption

    @root.style.opacity = 0
    @load-count += 1
    img.onload = ~>
      @load-count -= 1
      img-holder.style.backgroundImage = "url(#src)"
      div.append-child img-holder
      if cdiv
        div.append-child cdiv
      if @load-count == 0
        fade-in @root
    img.src = src

  nest: ~>
    @parents = @parents or []
    @parents.push @el
    @row-els = @row-els or []
    @row-els.push @row-el
    new-parent = @make-div!
    new-parent.style.flex-direction = \column
    new-parent.style.display = \flex
    new-parent.style.padding = 0
    @el = new-parent
    @new-row!

  end-nest: ~>
    @el = @parents.pop!
    @row-el = @row-els.pop!

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
    @new-row!
    @genfunc! # actually fill stuff

