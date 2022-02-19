const md = require('../').block;

module.exports = {

	unordered : {
		$basic : (t)=>{
			const res = md(`- this
- is an
- unordered *list*`)
			console.log(res)
			t.is(res, `<ul>
	<li>this</li>
	<li>is an</li>
	<li>unordered <strong>list</strong></li>
</ul>`);
		},

		_two_lists : (t)=>{
			const res = md(`
- this
- is an

- unordered *list*`);
			console.log(res)
			t.is(res, `<ul>
	<li>this</li>
	<li>is an</li>
	<li>unordered <strong>list</strong></li>
</ul>`);
		},

		$nested : (t)=>{
			const res = md(`
- this
	1. is an


	- round two
		- Really nested
- unordered *list*`)
			console.log(res)
			t.is(res, `<ul>
	<li>this</li>
	<li>is an</li>
	<li>unordered <strong>list</strong></li>
</ul>`);



		}

	},

	ordered : {

	},

	mixed : {
		basic : (t)=>{

		}
	},


}