const test = require('pico-check');
const md = require('../pico-md.js');

const html2json = require('html2json').html2json;


test('basic fence works', (t)=>{
	const res = html2json(md(`::: test
I am content
:::
`))

	const node = res.child[0];
	t.is(node.tag, 'div');
	t.is(node.attr.class, 'test');
	t.is(node.child[0].text, '\nI am content\n');
});




module.exports = test;