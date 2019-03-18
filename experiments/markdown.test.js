const _ = require('lodash');

const brewdown = require('./brewdown.js');


const tests = {
headers :
`# hello ^there*^ yo* ^

## Neat *guy*`,

list :
`- *this* is a list
- how [cool](neato) is this`,

codeblock :
`\`\`\`
- *this* is a list
- how cool is this
\`\`\``,

blocks :
`{{this,is

## yo \`javascript\`

is *a* block}}`,


image :
`![](http://i.imgur.com/sjNZ4os.gif)
![cool gif](http://i.imgur.com/sjNZ4os.gif)`

};


_.each(tests, (input, name)=>{
	console.log(`\n---- ${name} ---`);
	console.log(brewdown(input));
})



