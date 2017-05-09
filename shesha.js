// Generated by LiveScript 1.5.0
(function(){
  var R, pick, roll, deck, fadeIn, snake2camel, Generator, WidgetRenderer, textarea;
  R = function(it){
    return ~~(it * Math.random());
  };
  pick = function(it){
    return it[R(it.length)];
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
    var opacity, fadeInH;
    opacity = 0;
    fadeInH = function(){
      opacity += 1;
      el.style.opacity = opacity / 100;
      if (opacity >= 100) {
        return;
      }
      return setTimeout(fadeInH, 1);
    };
    return fadeInH();
  };
  snake2camel = function(it){
    return it[0] + it.split('-').map(function(it){
      return it[0].toUpperCase() + it.slice(1);
    }).join('').slice(1);
  };
  Generator = (function(){
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
      if (funcname === 'roll') {
        words = words.map(function(it){
          return +it;
        });
      }
      return this[funcname].apply(this, words);
    };
    Generator.prototype.render = function(template, inner){
      var out, ci, ref$, step, key;
      inner == null && (inner = false);
      out = '';
      ci = 0;
      while (ci < template.length && template[ci] !== ']') {
        if (template[ci] === '[') {
          ref$ = this.render(template.substr(ci + 1), true), step = ref$[0], key = ref$[1];
          ci += 2 + step;
          out += this.render(this.sources[key]());
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
    Generator.prototype.makeWidget = function(sel){
      var el, wr;
      sel == null && (sel = '.shesha-widget');
      el = document.querySelector(sel);
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
      this$.endColumn = bind$(this$, 'endColumn', prototype);
      this$.startColumn = bind$(this$, 'startColumn', prototype);
      this$.image = bind$(this$, 'image', prototype);
      this$.print = bind$(this$, 'print', prototype);
      this$.newRow = bind$(this$, 'newRow', prototype);
      this$.makeVertDiv = bind$(this$, 'makeVertDiv', prototype);
      this$.makeDiv = bind$(this$, 'makeDiv', prototype);
      this$.sources = this$.gen.sources;
      this$.vert = false;
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    WidgetRenderer.prototype.makeDiv = function(){
      var div, percent, i$, ref$, len$, cell;
      div = document.createElement('div');
      div.style.width = '100%';
      div.style.float = 'left';
      div.style.border = "1px solid black";
      this.row.push(div);
      this.rowEl.appendChild(div);
      percent = 100 / this.row.length + '%';
      for (i$ = 0, len$ = (ref$ = this.row).length; i$ < len$; ++i$) {
        cell = ref$[i$];
        cell.style.width = percent;
      }
      return div;
    };
    WidgetRenderer.prototype.makeVertDiv = function(){
      var div, parent, ref$, percent, i$, len$, cell;
      div = document.createElement('div');
      div.style.width = '100%';
      div.style.float = 'left';
      div.style.border = "1px solid black";
      parent = (ref$ = this.rowEl.children)[ref$.length - 1];
      parent.appendChild(div);
      percent = 100 / parent.children.length + '%';
      for (i$ = 0, len$ = (ref$ = parent.children).length; i$ < len$; ++i$) {
        cell = ref$[i$];
        cell.style.height = percent;
      }
      return div;
    };
    WidgetRenderer.prototype.newRow = function(){
      this.row = [];
      this.rowEl = document.createElement('div');
      this.rowEl.style.width = '100%';
      return this.el.appendChild(this.rowEl);
    };
    WidgetRenderer.prototype.print = function(template){
      var out, divmaker, div;
      out = this.gen.render(template);
      divmaker = (this.vert && this.makeVertDiv) || this.makeDiv;
      div = divmaker();
      div.style.textAlign = 'center';
      div.style.padding = '10px';
      div.innerHTML = out;
      div.style.fontSize = '20px';
      if (!this.vert) {
        div.style.height = '50px';
      }
      div.style.display = 'flex';
      div.style.alignItems = 'center';
      return div.style.justifyContent = 'center';
    };
    WidgetRenderer.prototype.image = function(template){
      var src, div, img;
      src = this.gen.render(template);
      div = this.makeDiv();
      img = new Image();
      div.style.height = '300px';
      div.style.backgroundSize = 'cover';
      div.style.backgroundPosition = "center center";
      img.onload = function(){
        div.style.opacity = 0;
        div.style.backgroundImage = "url(" + src + ")";
        return fadeIn(div);
      };
      return img.src = src;
    };
    WidgetRenderer.prototype.startColumn = function(){
      var col;
      this.oldvert = this.vert;
      col = this.makeDiv();
      col.style.height = '100%';
      return this.vert = true;
    };
    WidgetRenderer.prototype.endColumn = function(){
      return this.vert = this.oldvert;
    };
    WidgetRenderer.prototype.style = function(key, val){
      return this.rowEl.style[key] = val;
    };
    WidgetRenderer.prototype.colWidths = function(){
      var widths, res$, i$, to$, cols, ci, percent, results$ = [];
      res$ = [];
      for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      widths = res$;
      cols = this.rowEl.children;
      for (i$ = 0, to$ = cols.length; i$ < to$; ++i$) {
        ci = i$;
        percent = widths[widths.length - 1];
        if (ci < widths.length) {
          percent = widths[ci];
        }
        results$.push(cols[ci].style.width = percent + '%');
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
  textarea = document.querySelector('textarea');
  textarea.onkeyup = function(){
    var gen, e;
    gen = new Generator();
    try {
      gen.readGenerator(textarea.value);
      return gen.makeWidget('#carousel');
    } catch (e$) {
      e = e$;
      return 'ok';
    }
  };
  textarea.onkeyup();
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
