const md = require('../').block;

module.exports = {

	blockquote : (t)=>{

		const res = md(`> This is
> a *blockquote!*`)
		t.is(res, `<blockquote>This is\na <strong>blockquote!</strong></blockquote>`);

	},

	para : {
		basic : (t)=>{
			const res = md(`*Hello!*`)
			console.log(res)
		},

		multi : (t)=>{
			const res = md(`

*Hello!*
this is more text

a new paragraph`)
			console.log(res)
		}
	}

}