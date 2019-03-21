const test = require('pico-check');
const md = require('../pico-md.js');

const html2json = require('html2json').html2json;

test.group('html sanatization', (test)=>{
	test('sanatizes by default', (t)=>{
		const res = html2json(md(`<div>yo</div>`))
		const node = res.child[0];

		t.is(node.child[0].text, '&lt;div&gt;yo&lt;/div&gt;');
	});

	test('can allow html', (t)=>{
		const res = html2json(md(`<div>yo</div>`, {allowHtml : true}))
		const node = res.child[0];

		t.is(node.tag, 'div');
		t.is(node.child[0].text, 'yo');
	});

	test('always sanatizes script tags', (t)=>{
		const basic = html2json(md(`<script>alert('yo')</script>`))
		t.is(basic.child[0].tag, 'p');
		t.is(basic.child[0].child[0].text, `&lt;script&gt;alert('yo')&lt;/script&gt;`);

		const allowed = html2json(md(`<script>alert('yo')</script>`, {allowHtml : true}));
		t.is(basic.child[0].tag, 'p');
		t.is(basic.child[0].child[0].text, `&lt;script&gt;alert('yo')&lt;/script&gt;`);
	});
});

test.group('image modifications', (test)=>{
	test('base image syntax works', (t)=>{
		const res = html2json(md('![](https://img.com/img)'))
		const node = res.child[0].child[0];

		t.is(node.tag, 'img');
		t.is(node.attr.src, 'https://img.com/img');
		t.is(node.attr.alt, '');
		t.is(node.attr.class, '');
	});

	test('can add class names to images', (t)=>{
		const res = html2json(md('![cool image](https://img.com/img)'))
		const node = res.child[0].child[0];

		t.is(node.tag, 'img');
		t.is(node.attr.src, 'https://img.com/img');
		t.is(node.attr.alt, ['cool', 'image']);
		t.is(node.attr.class, ['cool', 'image']);
	});
})






module.exports = test;