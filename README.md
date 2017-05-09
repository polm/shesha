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
- **img**: like `print`, but it expects to get an image url
- **start-column**: changes print to stack boxes vertically
- **end-column**: changes print back to working horizontally
- **style**: set the CSS attribute of the current row
- **roll**: roll dice. Takes three values: number of dice to roll, sides per die, and bonus to apply.
- **col-widths**: set widths of elements in the current row by percent.

## License

WTFPL, do as you please.
