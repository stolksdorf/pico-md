const test = require('pico-check');
const md = require('../pico-md.js');

const html2json = require('html2json').html2json;


test('basic metadata works', (t)=>{
	const res = md(`---
title: my title
tags :
  - fancy
  - post
---
# Title`);
	const nodes = html2json(res);
	t.is(res.meta.title, 'my title');
	t.is(res.meta.tags.length, 2);
	t.is(nodes.child[0].tag, 'h1');
});


test('handles non-closed meta', (t)=>{
	const res = md(`---
 title : test
# Title`);

	const nodes = html2json(res);
	t.is(res.meta, undefined);
	t.is(nodes.child[0].tag, 'hr');
});




module.exports = test;