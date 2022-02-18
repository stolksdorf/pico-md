
/*

blockquote: (^>(.*)\n?)+
unordered list: (^[ \t]*-(.*)\n?)+
ordered list: (^[ \t]*[0-9]+\.(.*)\n?)+
list: (^[ \t]*([0-9]+\.|-)(.*)\n?)+
code: ^```(.*)([\s\S]*?)^```
table: (^\|(.*)\|\n?)+
header: ^(#{1,5})([^#\n]+)


blockquote: (^>(.*)\n?)+
unordered list: (^[ \t]*-(.*)\n?)+
ordered list: (^[ \t]*[0-9]+\.(.*)\n?)+
list: (^[ \t]*([0-9]+\.|-)(.*)\n?)+
code: ^```(.*)([\s\S]*?)^```
table: (^\|(.*)\|\n?)+
header: ^(#{1,5})([^#\n]+)
*/


const wrap=(tag)=>new RegExp(`(?<=\\W|^)\\${tag}(.+?)\\${tag}(?=\\W|$)`,'gm');
const rules = [
	[wrap('_'), (_,a)=>`<em>${a}</em>`],
	[wrap('*'), (_,a)=>`<strong>${a}</strong>`],
	[wrap('~~'), (_,a)=>`<del>${a}</del>`],
	[/!\[([^\]]*)\]\((.*?)\)/gm, (_,a,b) => `<img alt='${a}' src='${b}'></img>`],
	[/\[([^\]]+)\]\((.*?)\)/gm, (_,a,b) => `<a href='${b}'>${a}</a>`],
	[/^-{3,}/gm ,()=>`<hr />`],
	[/(?<=\W|^){{([\w,]+)\s*/gm, (_,a)=>`<div${a?` class="${a.replace(/,/g, " ")}"`:''}>`],
	[/}}(?=\W|$)/gm, ()=>`</div>`],
];
const inline = (str)=>{
	let codetags = [];
	return rules.reduce((acc, [rgx, fn])=>acc.replace(rgx, fn),
			str.trim().replace(wrap('`'), (_,a)=>{codetags.push(a);return '¸';}))
		.replace(/¸/g, ()=>`<code>${codetags.shift()}</code>`);
};



const blockparse = (rules, text, fallback)=>{
	let remaining = text, result = [];
	while(remaining.length > 0){
		let match = rules.reduce((best, [rgx, fn])=>{
			let match = rgx.exec(remaining);
			if(!match) return best;
			if(!best || match.index < best.index){ match.func = fn; return match; }
			return best;
		}, false);
		if(!match) break;
		const [text, ...groups] = match;
		const pre = remaining.substring(0,match.index).trim();
		if(fallback && pre) result.push(fallback(pre));
		result.push(match.func(text, ...groups));
		remaining = remaining.substring(match.index + text.length);
	}
	remaining = remaining.trim();
	if(fallback && remaining) result.push(fallback(remaining));
	return result;
};


const Rules = Object.values({
	CodeBlock : [/^```(.*)([\s\S]*?)^```/m,
		(_,lang,content)=>{
			return `<pre${lang ? ` class="${lang}"`:''}><code>${content}</code></pre>`;
		}
	],
	//add condition for sanatize HTML >
	BlockQuote: [/(^>(.*)\n?)+/m,
		(text)=>{
			return `<blockquote>${inline(text.replace(/^> ?/gm, ''))}</blockquote>`;
		}
	],
	HorizontalRule: [/^-{3,}/m, ()=>`<hr />`],
	Header: [/^(#{1,5}) *([^#\n]+)/m,
		(_,{length},text)=>{
			const id = text.replace(/[^a-zA-Z0-9 ]/g, '').replace(/ /g, '_');
			return `<h${length} id="${id}">${inline(text)}</h${length}>`
		}
	],
	Table : [/(^\|(.*)\|\n?)+/m,
		(text)=>{
			let lines = text.trim().split('\n');
			lines = lines.map(line=>line.slice(1,-1).split('|'));

			let headers = lines[1].reduce((acc, line)=>{
				if(!acc) return acc;
				if(/\s*:-{3,}:\s*/.test(line)) return acc.concat('center');
				if(/\s*-{3,}:\s*/.test(line)) return acc.concat('right');
				if(/\s*:?-{3,}\s*/.test(line)) return acc.concat('left');
				return false;
			}, []);

			if(!headers){
				return `<table>\n${lines.map(line=>{
					return `\t<tr>\n${line.map(cell=>`\t\t<td>${inline(cell)}</td>`).join('\n')}\n\t</tr>`
				}).join('\n')}\n</table>`;
			}
			//TODO: FIGURE OUT HEADERS
			return 'FIURE OUT HEADERS'
		}
	],
	List : [/(^[ \t]*([0-9]+\.|-)(.*)\n?)+/m,
		(text)=>{
			console.log(text)
			const lines = text.trim().split('\n').map(line=>{
				let [_, indent, type, text] = /(\s*)(-|[0-9]+\.) ?(.*)/.exec(line);
				return {
					type: type=='-'?'ul':'ol',
					idt:indent.length,
					text:inline(text)
				}
			});

			let res = '';
			let stack = [];
			lines.map(({type, idt, text})=>{
				if(!stack.length){
					stack.push({type, idt});
					res = `<${type}><li>${text}`;
					return;
				}
				if(idt == stack[0].idt){
					res += `</li>\n<li>${text}`;
				}
				if(idt > stack[0].idt){
					res += `<${type}><li>${text}`;
					stack.unshift({type, idt});
				}
				if(idt < stack[0].idt){
					res += `</li></${stack[0].type}><li>${text}`;
					stack.shift();
				}
				console.log({stack})
			});

			res += `</li></${stack[0].type}>`;


			console.log(res)
			console.log('-----')

			// let stack = [{}];
			// let res = '<ul>';

			// let result = ['<ul>'];

			// lines.map(({type, idt, text})=>{
			// 	if(stack[0].idt < idt){
			// 		stack.unshift({type, idt, text});
			// 	}
			// 	if(stack[0].idt > idt){
			// 		stack.shift({type, idt, text});
			// 	}
			// 	//console.log({text, stack})

			// 	result.push(`${' '.repeat(idt+2)}<li>${text}<li>`);

			// 	// //if type change, swap stack
			// 	// //if indent increase, add to stack
			// 	// //if indent decrease, pop from stack

			// 	// if(!stack[0]){
			// 	// 	res += `<${type}>\n`;
			// 	// }else if(stack[0].type !== type){
			// 	// 	res += `</${stack[0].type}>\n<${type}>`;
			// 	// }

			// 	// res += `\t<li>${text}</li>\n`;

			// 	// stack.unshift({type, idt, text});
			// })

			// result.push('</ul>')

			// res += `<${stack[0].type}>`;

			// // console.log(result)
			// // console.log('-------')

			// return res;
		}
	],
	//OpenDiv
	//CloseDiv
});

const Paragraph = (text)=>{
	return `<p>${text.split('\n\n').map(inline).join('</p>\n<p>')}</p>`
}




// const RULES = [
// 	//[/^```(.*)([\s\S]*?)^```/m, (_,a,b,c)=>['code' ,{_,a,b,c}]],


// 	[/^-{3,}/m, ()=>`<hr />`],

// 	[/(^>(.*)\n?)+/m, (_,a,b,c)=>['blockquote' ,{_,a,b,c}]],
// 	[/(^[ \t]*([0-9]+\.|-)(.*)\n?)+/m, (_,a,b,c)=>['list' ,{_,a,b,c}]],
// 	[/(^\|(.*)\|\n?)+/m, (_,a,b,c)=>['table' ,{_,a,b,c}]],
// 	[/^(#{1,5}) *([^#\n]+)/m, (_,a,b,c)=>['header' ,{_,a,b,c}]],


// 	//Add div support
// ];


const extractMeta = (text)=>{
	return {meta : undefined, text : text};
};

const sanatizeHTML = (text)=>text;



const md = (str, opts={})=>{
	opts = {allowHTML: false, meta:null, ...opts};
	const {text, meta} = extractMeta(str);
	if(opts.allowHTML) text = sanatizeHTML(text);

	const html = blockparse(Rules, text, Paragraph).join('\n\n');

	if(opts.meta || (opts.meta!==false && meta)) return {meta, html}
	return html;
}



const res = md(` just some text on the top

# this is a _title!_

> blockquote *with some bolding*
> {{red some text}}
> and another

- a simple
- unordered _list_
- okay!


- a simple
  - unordered _list_
  - okay!
- yo


- nested
  1. with differnt
  1. types
- still a list though
  - and can nest
- test




- split
1. number




\`\`\`with_lang

A wild code block!
> blockquote
> and another

\`\`\`

-------------

and some more text

and some more!

| fdg  | dfgdfg |        |   |   |
|----: | :---: |--------|---|---|
|      |        | dfgdfg |   |   |
|      |        |        |   |   |
| dfgg |        | dfg    |   |   |


|simple|table|
|_yo_ | table!  |


and just some rando text

`);


//console.dir(res)