const engine = require('./engine.js');


const input = `aaabc`

const rules ={
	a : {
		regex : /a(a)/,
		render : (text)=>{
			return 'x'
		}
	},
	b : {
		regex : /b/,
		render : (text)=>{
			return 'y'
		}
	},
	d : {
		regex : /d/,
		render : (text)=>{
			return 'yo yo yo'
		}
	}
};


const result = engine(rules, input);

console.log(result);