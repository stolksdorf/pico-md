# #️⃣ pico-marked
> A featherweight markdown parser that's easy to extend



### Features
- Easily extendable
- Option to not sanatize HTML
- Able to extend the Markdown rule sets
- Handles metadata using [simple trnp syntax](https://github.com/stolksdorf/trnp#simple-version)
- Only one way to do things. The Markdown spec has multiple ways of annotating the same thing, `pico-md` only has one method per annotation.
- No dependacies
- Only **175** lines of code


```
npm i pico-md
```

```js

const md = require('pico-md');

md(`# This is _Markdown!_

This is parsed using [\`pico-md\`](https://github.com/stolksdorf/pico-md).

`);
```


## Spec

### Inline Rules

- `*bold*`
- `_italic_`
- `~strikeout~`
- `![image alt text](https://image.url)`
- `[link text](https://link.url)`
- `\`inline code\``
- `{{div,with,classes`
- `}}` (closing div)


### Block Rules

#### Code Block
```
\`\`\`js
A block of
unformatted *code*
\`\`\`
```

#### Block Quote
```
> A _multiline_
> blockquote!
```

#### Horizontal Rule
```
Above the line
---
Below the line
```

#### Headers
```
## I am a second level header

##### I am a fifth level header
```

#### Tables
```
| Table | Column      |
|-------:|  :---: |
| With  | _alignment_ |

| Table | Column |
| That's| just simple|
```

#### Lists
```
- Nested
  - Unordered
    - Lists
- Ordered
  1. Lists
  1. That disregard
  60. numbers

4. This ordered List
1. starts at 4
```


### Modifying the rulesets



### Options

##### `allowHtml`: `true, false`, default: `false`
By default `pico-md` will "sanatize" any HTML in the input. It only odes a naive HTML sanatization. If you need something more intense, I suggest using another library to pre-process your text.


##### `meta`: `undefined, true, or false`, default: `undefined`
Sets how the library will return metadata. If `undefined`, it will return an object contain both the metadata and the HTML if metadata is present; If metadata is not present, it will just return the HTML. If aset to `true` if will **always** return an object, regardless if there's metadata or not. If set to `false` it will **always** return just a string, even if there is metadata present.



### Metadata
You can store metadata about the markdown file at the top of the file inbetween `---`. The text must start with `---`. `pico-md` uses [simple trnp syntax](https://github.com/stolksdorf/trnp#simple-version) for converting the metadata into a JSON object.


```markdown
---
title: Blogging Like a Regular Guy
tags : - post
       - updates
published: true
---

# Blogging Like a Regular Guy
Hello, welcome to my blog ...
```




## How It Works

`pico-md` is broken into two parsers: a block-level parser, and a inline-level parser. The inline parser handles rulesets that occur within flowing text; bolds, italics, links, images, etc. The block-level parser is looking for the large chunks of markdown that need to be parsered speacially; Headers, tables, code blocks, blockquotes, paragraphs, etc. Both rulesets follow the same structure, an array of rules where each rule is a 2 two element array of a regular expression and a function.

The inline parser loops over each rule and applies the `function` to all tokens that match the `regex`.

The block parser works slightly differently. It loops over each rule's `regex` and picks the one the matches the earliest within the remaining text, it then runs the rule's `function` on the match and adds the returned value to the result. If there's any text above the match that wasn't part of it, that text is ran through the `fallback` rule, which normally handles the Markdown paragraph rules. Many of the block level rules use the Inline parser within them.




## Why Not Use An Existing Library?

I've used many many markdown parsers over my career, and unfortunately due to the Markdown Spec not being well-defined, or consistently implemented it has led to a fair amount of fragmentation in this space. One library might allow you to pass through HTML, but not have the strikeout syntax, another might allow metadata.

On top of that I found the code behind the markdown parsers I've used to be quite hard to follow and able to modify or add tweaks to if needed. Most use a pretty bespoke lexer and tokenizer process tailored to the exact spec they are implemented, meaning add a new rule or slightly changing one (sush as `_` meaning italics instead of `*`) is nearly impossible or causes bugs to other places.

`pico-md` was built in a way that reduces code iteractions between different rules within the markdown spec, so it is much easier to modify and tweak.

Also `pico-md` is incredibly lightweight, stripping out more obscure parts of the spec, and eliminating the need for dependacies. This library is able to be dropped into any frontend or backend project, making it suitable for isomorphic web development as well.


