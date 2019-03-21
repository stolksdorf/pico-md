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






module.exports = test;