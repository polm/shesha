
# params
SOURCES = ""
DELAY = 3 # seconds

R = -> ~~(it * Math.random!)
pick = -> it[R it.length]

non-repeating-pick = (ll) ->
  # pick a random element, but not the current one
  picked = pick ll
  return ->
    picked := pick ll.filter -> it != picked
    return picked

after = (s, func) ->
  set-timeout func, (s * 1000)

do-every = (s, func) ->
  set-interval func, (s * 1000)

make-inside = ->
  el = document.create-element 'div'
  el.style.backgroundSize = \cover
  el.style.width = '100%'
  el.style.height = '100%'
  el.style.position = \absolute
  el.style.top = 0
  el.style.left = 0
  return el

set-bg = (el, bg) ->
  img = new Image!
  img.onload = ->
    el.style.backgroundSize = \cover
    el.style.backgroundImage = "url(#bg)"
  img.src = bg

fade-in-bg = (el, bg) ->
  old = el.query-selector \div
  # preload
  bgholder = make-inside!
  set-bg bgholder, bg
  el.append-child bgholder

  opacity = 0

  fade-in = ->
    opacity += 1
    bgholder.style.opacity = opacity / 100
    if opacity >= 100
      if old then el.remove-child old
      return

    after 0.01, fade-in

  fade-in!


make-carousel = (el, bgs) ->
  el.style.position = \relative
  get-bg = non-repeating-pick bgs
  fade-in-bg el, get-bg!
  do-every 3, -> fade-in-bg el, get-bg!

make-spinner = (el, bgs) ->
  el.style.position = \relative
  get-bg = non-repeating-pick bgs
  el.onclick = -> set-bg el, get-bg!
  el.onclick!

el = document.query-selector \#carousel

bgs = """
/imgs/tumblr_oaeftcUqYh1v53huuo3_540.jpg
/imgs/tumblr_oaeftcUqYh1v53huuo5_540.jpg
/imgs/tumblr_oaeftcUqYh1v53huuo10_540.jpg
/imgs/tumblr_oaeftcUqYh1v53huuo4_400.jpg
/imgs/tumblr_oaeftcUqYh1v53huuo6_400.jpg
/imgs/tumblr_oaeftcUqYh1v53huuo1_540.jpg
/imgs/tumblr_oaeftcUqYh1v53huuo9_540.jpg
/imgs/tumblr_oaeftcUqYh1v53huuo8_400.jpg
/imgs/tumblr_oaeftcUqYh1v53huuo7_400.jpg
/imgs/tumblr_oaeftcUqYh1v53huuo2_540.jpg
""".trim!.split ("\n")

#make-carousel el, bgs

make-spinner el, bgs

