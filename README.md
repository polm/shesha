# Shesha

A tool for quickly building random generators. *HIGHLY EXPERIMENTAL*, even the name may change at this point.

To use, check out the git repo, start up an HTTP server, and give it a look.

The left pane is code, and after every keypress the right pane is updated. 

The code in the left pane is divided into blocks separated by blank lines. There are three kinds of blocks.

`deck` and `die` create random sources you can use in the generator. They both have this format, using `deck` as an example:

    deck my deck name goes here
    entry 1
    entry 2
    entry 3

A few things to note:

- no quotes are needed anywhere
- spaces in the name of the source are OK
- each possible random value goes on its own line

The difference between a `die` and a `deck` is that a `die` **can** repeat values in one run of the generator, while a `deck` **can not**.

`generator` is the command that builds the widget. There are a lot of commands you can use inside it. (This syntax is terrible so it **will** change.)

- **new-row**: make a new row in the generator.
- **print**: make a new cell in the row, and put text inside it. Terms inside `[brackets]` are taken to be the names of sources (dice or decks set before). Brackets can be nested.
- **image**: like `print`, but it expects to get an image url. Any text after the url becomes a caption.
- **style**: set the CSS attribute of the current row
- **roll**: roll dice. Takes three values: number of dice to roll, sides per die, and bonus to apply.
- **col-widths**: set widths of elements in the current row by ratio (uses flexbox).
- **save**: saves the result of a template to a source with the given name. This is a bit complicated, so here's an example:

```
    deck people
    Alice
    Bob

    generator
    save first [people]
    save second [people]
    print [first] said to [second] "Hello [second]"
```

There are also embedded commands that can go in text passed to `print` and the like. 

- **roll**: Roll dice in-line. Ex: `print HP: [!r 1]` (rolls 1d6)
- **choose**: Choose from an in-line list. The first non-whitespace character is used as the delimiter. Ex: `print You see a [!c /wizard/fighter/thief/]`

## License

WTFPL, do as you please.
