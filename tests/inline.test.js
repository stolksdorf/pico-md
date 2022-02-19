const md = require('../').inline;

module.exports = {
	italic : {
		empty : (t)=>{
			const res = md(`__`);
			t.is(res, `<em></em>`)
		},
		mulitple : (t)=>{
			const res = md(`Okay _this_ is _so cool_`);
			t.is(res, `Okay <em>this</em> is <em>so cool</em>`)
		},
		mixed  : (t)=>{
			const res = md(`Okay *_this_* is _so *cool*_`);
			t.is(res, `Okay <strong><em>this</em></strong> is <em>so <strong>cool</strong></em>`)
		},
		unclosed : (t)=>{
			const res = md(`Okay _this is left open`);
			t.is(res, `Okay _this is left open`)
		},
		multiline : (t)=>{
			const res = md(`Okay _this is left\n for multiple \n lines_ neat`);
			t.is(res, `Okay _this is left\n for multiple \n lines_ neat`)
		},
		escaped : (t)=>{
			const res = md(`Okay \_this\_ _but this_`);
			t.is(res, `Okay _this_ <em>but this</em>`)
		},
		in_words : (t)=>{
			const res = md(`This_is_just_stuff`);
			t.is(res, `This_is_just_stuff`)
		}
	},

	bold : {
		empty : (t)=>{
			const res = md(`**`);
			t.is(res, `<strong></strong>`)
		},
		mulitple : (t)=>{
			const res = md(`Okay *this* is *so cool*`);
			t.is(res, `Okay <strong>this</strong> is <strong>so cool</strong>`)
		},
		mixed  : (t)=>{
			const res = md(`Okay _*this*_ is *so _cool_*`);
			t.is(res, `Okay <em><strong>this</strong></em> is <strong>so <em>cool</em></strong>`)
		},
		unclosed : (t)=>{
			const res = md(`Okay *this is left open`);
			t.is(res, `Okay *this is left open`)
		},
		multiline : (t)=>{
			const res = md(`Okay *this is left\n for multiple \n lines* neat`);
			t.is(res, `Okay *this is left\n for multiple \n lines* neat`)
		},
		escaped : (t)=>{
			const res = md(`Okay \*this\* *but this*`);
			t.is(res, `Okay *this* <strong>but this</strong>`)
		},
		in_words : (t)=>{
			const res = md(`This*is*just*stuff`);
			t.is(res, `This*is*just*stuff`)
		}
	},

	strike : {
		empty : (t)=>{
			const res = md(`~~`);
			t.is(res, `<del></del>`)
		},
		mulitple : (t)=>{
			const res = md(`Okay ~this~ is ~so cool~`);
			t.is(res, `Okay <del>this</del> is <del>so cool</del>`)
		},
		mixed  : (t)=>{
			const res = md(`Okay _~this~_ is ~so _cool_~`);
			t.is(res, `Okay <em><del>this</del></em> is <del>so <em>cool</em></del>`)
		},
		unclosed : (t)=>{
			const res = md(`Okay ~this is left open`);
			t.is(res, `Okay ~this is left open`)
		},
		multiline : (t)=>{
			const res = md(`Okay ~this is left\n for multiple \n lines~ neat`);
			t.is(res, `Okay ~this is left\n for multiple \n lines~ neat`)
		},
		escaped : (t)=>{
			const res = md(`Okay \~this\~ ~but this~`);
			t.is(res, `Okay ~this~ <del>but this</del>`)
		},
		in_words : (t)=>{
			const res = md(`This~is~just~stuff`);
			t.is(res, `This~is~just~stuff`)
		}
	},

	links : {
		empty : (t)=>{
			const res = md(`[]()`);
			t.is(res, `<a href=''></a>`)
		},
		mulitple : (t)=>{
			const res = md(`[]() and []()`);
			t.is(res, `<a href=''></a> and <a href=''></a>`)
		},
		with_text : (t)=>{
			const res = md(`Hello [check it](https://gist.github.com/stolksdorf/258774eaa531b52aae4b269da1009b0c) this is a cool link`);
			t.is(res,`Hello <a href='https://gist.github.com/stolksdorf/258774eaa531b52aae4b269da1009b0c'>check it</a> this is a cool link`)
		},
		styling_inside : (t)=>{
			const res = md(`[very *important* _stuff_](./foo.png)`);
			t.is(res,`<a href='./foo.png'>very <strong>important</strong> <em>stuff</em></a>`)
		}
	},

	images : {
		empty : (t)=>{
			const res = md(`![]()`);
			t.is(res, `<img alt='' src=''></img>`)
		},
		mulitple : (t)=>{
			const res = md(`![]() and ![]()`);
			t.is(res, `<img alt='' src=''></img> and <img alt='' src=''></img>`)
		},
		with_text : (t)=>{
			const res = md(`Hello ![check it]() this is a cool image`);
			t.is(res,`Hello <img alt='check it' src=''></img> this is a cool image`)
		},
		complex_url : (t)=>{
			const res = md(`![](https://d33wubrfki0l68.cloudfront.net/f1f475a6fda1c2c4be4cac04033db5c3293032b4/513a4/assets/images/markdown-mark-white.svg)`);
			t.is(res,`<img alt='' src='https://d33wubrfki0l68.cloudfront.net/f1f475a6fda1c2c4be4cac04033db5c3293032b4/513a4/assets/images/markdown-mark-white.svg'></img>`)
		},
		nested : (t)=>{
			const res = md(`[![npm version](https://badge.fury.io/js/pico-md.svg)](https://badge.fury.io/js/pico-md)`)
			t.is(res, `<a href='https://badge.fury.io/js/pico-md'><img alt='npm version' src='https://badge.fury.io/js/pico-md.svg'></img></a>`)
		}
	},

	divs : {
		basic: (t)=>{
			const res = md(`Hey {{ this is a *div* }}`);
			t.is(res, `Hey <div class=''>this is a <strong>div</strong> </div>`);
		},
		with_classes: (t)=>{
			const res = md(`{{red,big_size,md-6 content}}`);
			t.is(res, `<div class='red big_size md-6'>content</div>`);
		},
		multiline: (t)=>{
			const res = md(`{{foo \nthis is a\nmultline div }}`);
			t.is(res, `<div class='foo'>this is a\nmultline div </div>`);
		},
		nested: (t)=>{
			const res = md(`{{big
{{red Big and Red}}
Just big }}`);
			t.is(res, `<div class='big'><div class='red'>Big and Red</div>\nJust big </div>`);
		},
	},

	code : {
		basic: (t)=>{
			const res = md('Hey `code formatting` yo');
			t.is(res, `Hey <code>code formatting</code> yo`);
		},
		multi: (t)=>{
			const res = md('Hey `code`, `formatting yeah`');
			t.is(res, `Hey <code>code</code>, <code>formatting yeah</code>`);
		},
		no_styling : (t)=>{
			const res = md('`*no bold* _no em_`');
			t.is(res, `<code>*no bold* _no em_</code>`);
		},
		escaped_code: (t)=>{
			const res = md('`test \`code\` test`');
			t.is(res, `<div class='red big_size md-6'>content</div>`);
		},
	}
}