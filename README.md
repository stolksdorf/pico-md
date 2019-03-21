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






## React Component
Renders markdown into HTML within this component.


| Props      | Type     | Description |
| :----      | :------- | :---------- |
|`content`   | _string_ | A string of markdown that will converted into HTML |
|`children`  | _string_ | A string of markdown that will converted into HTML |
|`className` | _string_ | Sets the className of the top level `div` |
|`options`   | _object_ | Options passed to the `pico-md` lib |
|`...props`  | _object_ | Any remaining props passed will be applied to the component's top level `div` |

```jsx
const Markdown = require('pico-md/component.js');


<Markdown>
# Header 1
Hi I'm text
</Markdown>

<Markdown content={`You can _pass_ in markdown as a prop`} />

<Markdown onClick={()=>alert('boo!')} options={{allowHtml : true}}>
This entire content is clickable <hr />
</Markdown>
```