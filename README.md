# #️⃣ pico-marked
A lightweight markdown library with some QoL features.

Currently a wrapper for [Marked](https://www.npmjs.com/package/marked).
~Inspired by [Marked](https://www.npmjs.com/package/marked)~

### Features
- Easily extendable
- Handles YAML-based metadata
- Handles [Fenced Div syntax](https://pandoc.org/MANUAL.html#divs-and-spans)
- Comes bundled with an easy-to-use React component









## Markdown Compoennt

Renders markdown into HTML within this component. We have some special styling reserved just for the Markdown component, including a clickable anchor tag to add a hash fragment to the URL.

*[Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)*

| Props      | Type     | Description |
| :----      | :------- | :---------- |
|`content`   | _string_ | A string of markdown that will converted into HTML |
|`children`  | _string_ | A string of markdown that will converted into HTML |
|`className` | _string_ | Sets the className of the top level `div` |
|`...props`  | _object_ | Any remaining props passed will be applied to the component's top level `div` |

```jsx
<Markdown>
# Header 1
Hi I'm text
</Markdown>

<Markdown content={`You can _pass_ in markdown as a prop`} />

<Markdown onClick={()=>alert('boo!')}>
This entire content is clickable
</Markdown>
```