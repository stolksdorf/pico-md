



let res = md(`---
Title:    A Sample MultiMarkdown Document
Author:   Fletcher T. Penney
Date:     February 9, 2011
Comment:  This is a comment intended to demonstrate
          metadata that spans multiple lines, yet
          is treated as a single value.
CSS:      http://example.com/standard.css
---



just some text on the top

# this is a _title!_
test
> blockquote *with some bolding*
> {{red some text}}
> and another

- a simple
- unordered _list_
- okay!


- a simple
  - unordered _list_
    - okay!
- yo


- nested
  1. with differnt
  1. types
- still a list though
  - and can nest



<div> this is some html </div>

\`\`\`with_lang

A wild code block!
> blockquote
> and another

\`\`\`

-------------

and some more text

and some more!

| fdg  | dfgdfg |        |   |   |
|----: | :---: |--------|---|---|
|      |        | dfgdfg |   |   |
|      |        |        |   |   |
| dfgg |        | dfg    |   |   |


|simple|table|
|_yo_ | table!  |

{{red


with a starting div}}

and just some rando text

okay cool! }}

`, {allowHTML: true, meta : undefined});

console.log(res)
