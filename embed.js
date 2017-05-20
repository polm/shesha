;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Generated by LiveScript 1.5.0
(function(){
  var Generator, i$, ref$, len$, el, gen, widgetContainer;
  Generator = require('./shesha').Generator;
  for (i$ = 0, len$ = (ref$ = document.querySelectorAll('.shesha-widget')).length; i$ < len$; ++i$) {
    el = ref$[i$];
    el.classList.remove('.shesha-widget');
    gen = new Generator();
    widgetContainer = document.createElement('div');
    widgetContainer.style.opacity = 0;
    widgetContainer.style.maxWidth = '800px';
    el.parentNode.insertBefore(widgetContainer, el.nextSibling);
    gen.readGenerator(el.textContent);
    gen.makeWidget(widgetContainer);
  }
}).call(this);

},{"./shesha":2}],2:[function(require,module,exports){
// Generated by LiveScript 1.5.0
(function(){
  var R, pick, errorOutput, roll, choose, deck, fadeIn, snake2camel, Generator, WidgetRenderer, out$ = typeof exports != 'undefined' && exports || this;
  R = function(it){
    return ~~(it * Math.random());
  };
  pick = function(it){
    return it[R(it.length)];
  };
  errorOutput = function(it){
    return "<span style=\"color:red\">" + it + "</span>";
  };
  roll = function(num, sides, bonus){
    var res, i$, ii;
    num == null && (num = 1);
    sides == null && (sides = 6);
    bonus == null && (bonus = 0);
    if (num < 1) {
      num = 1;
    }
    res = bonus;
    for (i$ = 0; i$ < num; ++i$) {
      ii = i$;
      res += 1 + R(sides);
    }
    return res;
  };
  choose = function(){
    var template, delim, choices;
    template = Array.prototype.join.call(arguments, ' ');
    delim = template[0];
    choices = template.split(delim).filter(function(it){
      return it;
    });
    return pick(choices);
  };
  deck = function(items){
    var orig, res, this$ = this;
    items = items.slice(0);
    orig = items.slice(0);
    res = function(){
      var index, out;
      index = R(items.length);
      out = items[index];
      items.splice(index, 1);
      return out;
    };
    res.reset = function(){
      return items = orig.slice(0);
    };
    return res;
  };
  fadeIn = function(el){
    var ani;
    el.style.opacity = 0;
    if (!el.animate) {
      el.style.opacity = 1;
      return;
    }
    ani = el.animate({
      opacity: [0, 1]
    }, {
      duration: 100,
      easing: 'ease-in'
    });
    return ani.onfinish = function(){
      return el.style.opacity = 1;
    };
  };
  snake2camel = function(it){
    return it[0] + it.split('-').map(function(it){
      return it[0].toUpperCase() + it.slice(1);
    }).join('').slice(1);
  };
  out$.Generator = Generator = (function(){
    Generator.displayName = 'Generator';
    var prototype = Generator.prototype, constructor = Generator;
    function Generator(){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      this$.makeWidget = bind$(this$, 'makeWidget', prototype);
      this$.readGenerator = bind$(this$, 'readGenerator', prototype);
      this$.readTerms = bind$(this$, 'readTerms', prototype);
      this$.setGenerator = bind$(this$, 'setGenerator', prototype);
      this$.render = bind$(this$, 'render', prototype);
      this$.addDie = bind$(this$, 'addDie', prototype);
      this$.addDeck = bind$(this$, 'addDeck', prototype);
      this$.sources = {};
      this$.special = {
        r: roll,
        c: choose
      };
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    Generator.prototype.addDeck = function(name, items){
      return this.sources[name] = deck(items);
    };
    Generator.prototype.addDie = function(name, items){
      return this.sources[name] = function(){
        return pick(items);
      };
    };
    Generator.prototype.exec = function(line){
      var words, funcname;
      words = line.split(' ');
      funcname = snake2camel(words.shift());
      if (funcname === 'print') {
        words = [words.join(' ')];
      }
      if (funcname === 'image') {
        words = [words.join(' ')];
      }
      if (funcname === 'roll') {
        words = words.map(function(it){
          return +it;
        });
      }
      return this[funcname].apply(this, words);
    };
    Generator.prototype.render = function(template, inner, stack){
      var out, ci, ref$, step, key, words, cmd;
      inner == null && (inner = false);
      stack == null && (stack = []);
      out = '';
      ci = 0;
      while (ci < template.length && template[ci] !== ']') {
        if (template[ci] === '[') {
          ref$ = this.render(template.substr(ci + 1), true), step = ref$[0], key = ref$[1];
          ci += 2 + step;
          if (key[0] === '!') {
            key = key.substr(1);
            words = key.split(' ');
            cmd = words.shift();
            if (this.special[cmd]) {
              out += this.special[cmd].apply(this, words);
            } else {
              out += errorOutput("ERROR: no such special command: " + cmd);
            }
          } else {
            if (-1 < stack.indexOf(key)) {
              out += errorOutput("ERROR: loop detected on key: " + key);
              continue;
            }
            if (this.sources[key]) {
              out += this.render(this.sources[key](), false, stack.concat(key));
            } else {
              out += errorOutput("ERROR: no such source: " + key);
            }
          }
          continue;
        }
        out += template[ci];
        ci++;
      }
      if (inner) {
        return [ci, out];
      }
      return out;
    };
    Generator.prototype.setGenerator = function(it){
      return this.genfunc = it;
    };
    Generator.prototype.readTerms = function(lines, li){
      var terms, line, ref$;
      terms = [];
      for (;;) {
        li++;
        line = (ref$ = lines[li]) != null ? ref$.trim() : void 8;
        if (!line) {
          return terms;
        }
        terms.push(line);
      }
    };
    Generator.prototype.readGenerator = function(it){
      var lines, li, line, words, command, name, terms, commands, exec, results$ = [];
      lines = it.split('\n');
      li = 0;
      while (li < lines.length) {
        line = lines[li].trim();
        if (line[0] === '#') {
          li++;
          continue;
        }
        words = line.split(' ');
        command = words.shift();
        if (command === 'die') {
          name = words.join(' ');
          terms = this.readTerms(lines, li);
          this.addDie(name, terms);
          li += 1 + terms.length;
          continue;
        }
        if (command === 'deck') {
          name = words.join(' ');
          terms = this.readTerms(lines, li);
          this.addDeck(name, terms);
          li += 1 + terms.length;
          continue;
        }
        if (command === 'generator') {
          commands = this.readTerms(lines, li);
          exec = this.exec;
          this.setGenerator(fn$);
          li += 1 + commands.length;
          continue;
        }
        results$.push(li++);
      }
      return results$;
      function fn$(){
        var i$, ref$, len$, command, results$ = [];
        for (i$ = 0, len$ = (ref$ = commands).length; i$ < len$; ++i$) {
          command = ref$[i$];
          results$.push(exec.apply(this, [command]));
        }
        return results$;
      }
    };
    Generator.prototype.makeWidget = function(el){
      var wr;
      wr = new WidgetRenderer(this, el);
      wr.setGenerator(this.genfunc);
      wr.generate();
      return el.onclick = wr.generate;
    };
    return Generator;
  }());
  WidgetRenderer = (function(){
    WidgetRenderer.displayName = 'WidgetRenderer';
    var prototype = WidgetRenderer.prototype, constructor = WidgetRenderer;
    function WidgetRenderer(gen, el){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      this$.gen = gen;
      this$.el = el;
      this$.generate = bind$(this$, 'generate', prototype);
      this$.roll = bind$(this$, 'roll', prototype);
      this$.setGenerator = bind$(this$, 'setGenerator', prototype);
      this$.colWidths = bind$(this$, 'colWidths', prototype);
      this$.style = bind$(this$, 'style', prototype);
      this$.endNest = bind$(this$, 'endNest', prototype);
      this$.nest = bind$(this$, 'nest', prototype);
      this$.image = bind$(this$, 'image', prototype);
      this$.print = bind$(this$, 'print', prototype);
      this$.newRow = bind$(this$, 'newRow', prototype);
      this$.makeDiv = bind$(this$, 'makeDiv', prototype);
      this$.save = bind$(this$, 'save', prototype);
      this$.loadCount = 0;
      this$.root = this$.el;
      this$.sources = this$.gen.sources;
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    WidgetRenderer.prototype.save = function(key){
      var words, res$, i$, to$, template;
      res$ = [];
      for (i$ = 1, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      words = res$;
      template = words.join(' ');
      return this.gen.addDie(key, [this.gen.render(template)]);
    };
    WidgetRenderer.prototype.makeDiv = function(parent){
      var div;
      parent == null && (parent = this.rowEl);
      div = document.createElement('div');
      div.style.flex = 1;
      div.style.border = "1px solid black";
      div.style.textAlign = 'center';
      div.style.padding = '10px';
      div.style.fontSize = '20px';
      div.style.display = 'flex';
      div.style.alignItems = 'center';
      div.style.justifyContent = 'center';
      parent.appendChild(div);
      return div;
    };
    WidgetRenderer.prototype.newRow = function(){
      this.rowEl = document.createElement('div');
      this.rowEl.classList.add('row');
      this.rowEl.style.width = '100%';
      this.rowEl.style.display = 'flex';
      this.rowEl.style.flex = 1;
      return this.el.appendChild(this.rowEl);
    };
    WidgetRenderer.prototype.print = function(template){
      var out, div;
      out = this.gen.render(template);
      div = this.makeDiv();
      return div.innerHTML = out;
    };
    WidgetRenderer.prototype.image = function(template){
      var rendered, words, src, caption, div, img, imgHolder, cdiv, this$ = this;
      rendered = this.gen.render(template);
      words = rendered.split(' ');
      src = words.shift();
      caption = words.join(' ');
      div = this.makeDiv();
      div.style.display = 'flex';
      div.style.flexDirection = 'column';
      div.style.padding = 0;
      this.rowEl.style.height = '300px';
      div.style.height = '100%';
      img = new Image();
      imgHolder = document.createElement('div');
      imgHolder.style.flexGrow = 1;
      imgHolder.style.flex = 6;
      imgHolder.style.backgroundSize = 'cover';
      imgHolder.style.backgroundPosition = "center center";
      imgHolder.style.width = '100%';
      if (caption) {
        this.rowEl.style.height = '350px';
        cdiv = this.makeDiv(div);
        cdiv.style.width = '100%';
        cdiv.innerHTML = caption;
      }
      this.root.style.opacity = 0;
      this.loadCount += 1;
      img.onload = function(){
        this$.loadCount -= 1;
        imgHolder.style.backgroundImage = "url(" + src + ")";
        div.appendChild(imgHolder);
        if (cdiv) {
          div.appendChild(cdiv);
        }
        if (this$.loadCount === 0) {
          return fadeIn(this$.root);
        }
      };
      return img.src = src;
    };
    WidgetRenderer.prototype.nest = function(){
      var newParent;
      this.parents = this.parents || [];
      this.parents.push(this.el);
      this.rowEls = this.rowEls || [];
      this.rowEls.push(this.rowEl);
      newParent = this.makeDiv();
      newParent.style.flexDirection = 'column';
      newParent.style.display = 'flex';
      newParent.style.padding = 0;
      this.el = newParent;
      return this.newRow();
    };
    WidgetRenderer.prototype.endNest = function(){
      this.el = this.parents.pop();
      return this.rowEl = this.rowEls.pop();
    };
    WidgetRenderer.prototype.style = function(key, val){
      return this.rowEl.style[key] = val;
    };
    WidgetRenderer.prototype.colWidths = function(){
      var widths, res$, i$, to$, cols, ci, share, results$ = [];
      res$ = [];
      for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      widths = res$;
      cols = this.rowEl.children;
      for (i$ = 0, to$ = cols.length; i$ < to$; ++i$) {
        ci = i$;
        share = widths[widths.length - 1];
        if (ci < widths.length) {
          share = widths[ci];
        }
        results$.push(cols[ci].style.flex = share);
      }
      return results$;
    };
    WidgetRenderer.prototype.setGenerator = function(it){
      return this.genfunc = it;
    };
    WidgetRenderer.prototype.roll = function(){
      return this.print(roll.apply(this, arguments).toString());
    };
    WidgetRenderer.prototype.generate = function(){
      var source, ref$;
      for (source in this.sources) {
        if (typeof (ref$ = this.sources[source]).reset == 'function') {
          ref$.reset();
        }
      }
      this.el.innerHTML = '';
      this.newRow();
      return this.genfunc();
    };
    return WidgetRenderer;
  }());
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);

},{}]},{},[1])
;