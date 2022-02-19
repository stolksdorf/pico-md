/*

This matches on tables!

/(\|.+\|(\n|$))+/m



*/


const picoparse = (rules, text)=>{
	let remaining = text, result = [], skip=false, pos=0;
	while(remaining.length > 0){
		let match = rules.reduce((best, [rgx, fn])=>{
			let match = rgx.exec(remaining);
			if(!match) return best;
			if(!best || match.index < best.index){ match.func = fn; return match; }
			return best;
		}, false);
		if(!match) break;
		const [text, ...groups] = match;
		pos += match.index;
		const res = match.func(groups, {text, pos, pre:remaining.substring(0,match.index)})
		if(typeof res == 'boolean'){ skip = res; }
		else if(!skip && res){ result.push(res); }
		remaining = remaining.substring(match.index + text.length);
	}
	return result;
};


//pico-css, use as template
const parse = (str)=>{
	const parsed = picoparse([
		[/\/\*(\*(?!\/)|[^*])*\*\//, ()=>null],
		[/\s*\/\/.*/,                ()=>null],
		[/([^{};\s][^{};]*){/,       ([selector])=>['selc', selector.trim()]],
		[/([\w+-]+)\s*:\s*([^;]+);/, ([key, val])=>['rule', key, val]],
		[/}/,                        ()=>['close']],
	], str);

	let keys = [];
	return parsed.reduce((acc,[type, key, val])=>{
		if(type=='selc') keys.push(key);
		if(type=='close') keys.pop();
		if(type=='rule'){
			const {sel, media} = convertKeys(keys);
			const last = acc[acc.length-1]||{};
			if(sel!=last.sel || media!=last.media){
				acc.push({sel,media,rules:{}});
			}
			if(val.indexOf('}')!==-1||val.indexOf(':')!==-1) throw new Error(`ERR: CSS parsing error near: ${sel} -> ${key}`);
			acc[acc.length-1].rules[key] = val;
		}
		return acc;
	}, [])
};


// const ListRules = [

// '\n(&gt;|\>)(.*)' : (_,a,b)=>`<blockquote>${b.trim()}</blockquote>`,
// '<\/blockquote><blockquote>': ()=>'\n',


// '\n\-(.*)' : (_,a)=>`<ul>\n\t<li>${a.trim()}</li>\n</ul>`,
// '\n<\/ul>\s?<ul>': ()=>'',
// '\n[0-9]+\.(.*)' : (_,a)=>`<ol>\n\t<li>${a.trim()}</li>\n</ol>`,
// '\n<\/ol>\s?<ol>': ()=>'',

// ]


const BlockRules = [
	//Add in id
	//'(#+)(.*)' : (_,{length},a) =>`<h${length}>${a.trim()}</h${length}>`,

	//'\n-{3,}':()=>`\n<hr />`,
]

const inline = (str)=>{
	let code = [];
	return [
		[/`(.*?)`/g,   (_,a)=>{ code.push(a); return `˜${code.length-1}˜`}],

		[/!\[([^\]]*)\]\((.*?)\)/g, (_,alt,src) => `<img alt='${alt}' src='${src}'></img>`],
		[/\[([^\]]*)\]\((.*?)\)/g , (_,content,href) => `<a href='${href}'>${content}</a>`],

		[/\*(.*?)\*/g, (_,a)=>`<strong>${a}</strong>`],
		[/_(.*?)_/g,   (_,a)=>`<em>${a}</em>`],
		[/~(.*?)~/g,   (_,a)=>`<del>${a}</del>`],

		[/{{([\w-_,]*)\s*/g, (_,a)=>`<div class='${a.replace(/,/g, ' ')}'>`],
		[/}}/g,              (_,a)=>`</div>`],

		[/˜(\d+)˜/g, (_,a)=>`<code>${code[a]}</code>`]
	].reduce((acc, [rgx, func])=>acc.replace(rgx, func), str).trim();
};

const times = (n,fn)=>Array.from(new Array(n*1),(v,i)=>fn(i));

const makeId = (str)=>str.trim().replace(/ /g, '_').replace(/[^\w-_]/g,'').toLowerCase();


const ListParser = (str)=>{
	//Go line by line and build a smart datat structure, then collapse it into html

	// And do a quick cehck to see if the line starts with [], [ ], or [x] to inject a <input tag


	console.log('LIST')
	console.log(str)
	console.log('------')
	return '';
}


//TODO: convcert this to use picoparse
const block = (str)=>{
	let code = [];
	return [
		[/```([.\s]*)```/g,   (_,a)=>{ code.push(a); return `˜${code.length-1}˜`}],


		//Headers
		[/^(#+)(.*)/gm,  (_,{length},a) =>`<h${length} id='${makeId(a)}'>${inline(a)}</h${length}>`],


		[/((\n+|^)\t*(\-|[0-9]+\.).*)+/gm, (list)=>ListParser(list)],


		//Bockquote?
		 //(^(&gt;|\>)(.*)$)+


		// [/^(\t*)\-(.*)/gm, (_,indent,txt)=>{
		// 	console.log(indent.length, txt);
		// 	const front = times(indent.length, ()=>`{`).join('')
		// 	const back = times(indent.length, ()=>`}`).join('')
		// 	return `${front}<ul><li>${inline(txt)}</li></ul>${back}`
		// }],

		//Unordered
		// [/^(\t*)\-(.*)/gm, (_,indent,txt)=>{
		// 	console.log(indent.length, txt);
		// 	const front = times(indent.length, ()=>`<ul>`).join('')
		// 	const back = times(indent.length, ()=>`</ul>`).join('')
		// 	return `<ul>\n\t<li>${front}${inline(txt)}${back}</li>\n</ul>`
		// }],
		// [/^(\s*)[0-9]+\.(.*)/gm, (_,indent,txt)=>`<ol>\n\t<li>${inline(txt)}</li>\n</ol>`],


		//[/(<\/(ul|ol)>\s?<(ul|ol)>)+/gm, ()=>''],



		//Blockquote
		[/^(&gt;|\>)(.*)/gm, (_,a,txt)=>`<blockquote>${inline(txt)}</blockquote>`],
		[/<\/blockquote>\s?<blockquote>/g, ()=>'\n'],


		[/(^|\n\n)(.\s*)(\n\n|$)/g, (_,start,txt)=>{
			console.log('hit2')
			console.log(_)
			console.log('-----')
			return '<p>' + inline(_) + '</p>'
		}],


		[/˜(\d+)˜/g, (_,a)=>`<pre><code>${code[a]}</code></pre>`]
	].reduce((acc, [rgx, func])=>acc.replace(rgx, func), str);
};

module.exports = {
	inline,
	block
};