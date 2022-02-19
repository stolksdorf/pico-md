# #️⃣ pico-marked
A lightweight markdown library with some QoL features.

Currently a wrapper for [Marked](https://www.npmjs.com/package/marked).
~Inspired by [Marked](https://www.npmjs.com/package/marked)~

### Features
- Easily extendable
- Handles YAML-based metadata
- Handles [Fenced Div syntax](https://pandoc.org/MANUAL.html#divs-and-spans)
- Typed Code blocks
- Adds class names to images
- Comes bundled with an easy-to-use React component
- always santizes out `<script>` tags



```
npm i pico-md
```



### Options

- `renderer`: overwrites core renderer object
- `allowHtml`: false
- `frontmatter`: `undefined, true, or false`



## Metadata
You can store metadata about the markdown file at the top of the file inbetween `---` in either YAML or JSON, called [YAML Front Matter](https://jekyllrb.com/docs/front-matter/). `pico-md` will parse this and remove it from the rendered html string and attach the data to the returned string on a `meta` prop.


```markdown
---
layout: post
title: Blogging Like a Regular Guy
---

# Blogging Like a Regular Guy
Hello, welcome to my blog ...

```


```js
const md = require('pico-md');

const Post = md(/*Above markdown*/);

console.log(Post); // <h1>Blogging Like a Regular Guy</h1>...
console.log(Post.meta.layout); //'post'
console.log(Post.meta.title); //'Blogging Like a Regular Guy'
```



