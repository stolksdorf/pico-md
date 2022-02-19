const md = require('../').block;

module.exports = {
	basic : (t)=>{
		const res = md(`## Hello`)
		t.is(res, `<h2 id='hello'>Hello</h2>`);
	},
	id : (t)=>{
		const res = md(`# Hello there 34!`)
		t.is(res, `<h1 id='hello_there_34'>Hello there 34!</h1>`);
	},
	nested_styles : (t)=>{
		const res = md(`##### *Hello* {{small [info](/info.html) }}`)
		t.is(res, `<h5 id='hello_small_infoinfohtml_'><strong>Hello</strong> <div class='small'><a href='/info.html'>info</a> </div></h5>`);
	},

	new_line_only : (t)=>{
		const res = md(`dang yo ## *Hello*`)
		t.is(res, `dang yo ## *Hello*`);
	},

}