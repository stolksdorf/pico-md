
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

//TODFO: remember to expose rules
//TODO: bring trnp in here
//


const wrap=(tag)=>new RegExp(`(?<=\\W|^)\\${tag}(.+?)\\${tag}(?=\\W|$)`,'gm');
const rules = [
	[wrap('_'),                  (_,a)=>`<em>${a}</em>`],
	[wrap('*'),                  (_,a)=>`<strong>${a}</strong>`],
	[wrap('~~'),                 (_,a)=>`<del>${a}</del>`],
	[/^-{3,}/gm ,                ()=>`<hr />`],
	[/!\[([^\]]*)\]\((.*?)\)/gm, (_,a,b) => `<img alt='${a}' src='${b}'></img>`],
	[/\[([^\]]+)\]\((.*?)\)/gm,  (_,a,b) => `<a href='${b}'>${a}</a>`],
	[/(?<=\W|^){{([\w,]+)\s*/gm, (_,a)=>`<div${a?` class="${a.replace(/,/g, " ")}"`:''}>`],
	[/}}(?=\W|$)/gm,             ()=>`</div>`],
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
			if(match && (!best || match.index < best.index)){ match.func = fn; return match; }
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
	BlockQuote: [/(^(>|&gt;)(.*)\n?)+/m,
		(text)=>{
			return `<blockquote>${inline(text.replace(/^(>|&gt;) ?/gm, ''))}</blockquote>`;
		}
	],
	HorizontalRule: [/^-{3,}/m, ()=>`<hr />`],
	Header: [/^(#{1,5}) *([^#\n]+)/m,
		(_,{length},text)=>{
			const id = text.replace(/[^a-zA-Z0-9 ]/g, '').replace(/ /g, '_');
			return `<h${length} id="${id}">${inline(text)}</h${length}>`
		}
	],
	// TableWithAlignmnet : [/(^\|(.*)\|\n?)(^\|[\|\-: ]+\|\n?)(^\|(.*)\|\n?)+/m,
	// 	(text)=>{
	// 		let [headers, align, ...rows] = text.trim().split('\n').map(line=>line.slice(1,-1).split('|'));

	// 		align = align.map(cell=>{
	// 			if(/\s*:-{3,}:\s*/.test(cell)) return 'center';
	// 			if(/\s*-{3,}:\s*/.test(cell)) return 'right';
	// 			return '';
	// 		});

	// 		const getAlignment = (idx)=>align[idx]?` align="${align[idx]}"`:'';

	// 		let head = headers.map((h,idx)=>`\t\t<th${getAlignment(idx)}>${inline(h)}</th>`).join('\n');
	// 		let body = rows.map(line=>{
	// 			return `\t\t<tr>\n${line.map((cell,idx)=>`\t\t\t<td${getAlignment(idx)}>${inline(cell)}</td>`).join('\n')}\n\t\t</tr>`
	// 		}).join('\n');
	// 		return `<table>\n\t<thead><tr>\n${head}\n\t</tr></thead>\n\t<tbody>\n${body}\n\t</tbody>\n</table>`
	// 	}
	// ],
	// SimpleTable : [/(^\|(.*)\|\n?)+/m,
	// 	(text)=>{
	// 		let lines = text.trim().split('\n').map(line=>line.slice(1,-1).split('|'));
	// 		return `<table>\n${lines.map(line=>{
	// 			return `\t<tr>\n${line.map(cell=>`\t\t<td>${inline(cell)}</td>`).join('\n')}\n\t</tr>`
	// 		}).join('\n')}\n</table>`;
	// 	}
	// ],
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

			//TODO: forget type switching

			let foo= [];
			let res = '';
			let stack = [];
			lines.map(({type, idt, text})=>{
				if(!stack.length){
					stack.push({type, idt});
					res = `<${type}>\n${' '.repeat(idt+2)}<li>${text}`;

					foo.push(`<${type}>`);

					foo.push(`${' '.repeat(idt+2)}<li>`);
					foo.push(`${' '.repeat(idt+2)}${text}`);
					return;
				}
				// Loop through stack each time

				// stack.find(stk=>{


				// });


				if(idt == stack[0].idt){
					res += `</li>\n${' '.repeat(idt+2)}<li>${text}`;

					foo.push(`</li>`);


					// foo.push(`<li>`);
					// foo.push(text);
				}
				if(idt > stack[0].idt){
					res += ` <${type}>\n${' '.repeat(idt+2)}<li>${text}`;

					foo.push(`${' '.repeat(idt)}<${type}>`);

					// foo.push(`<li>`);
					// foo.push(text);


					stack.unshift({type, idt});
				}
				if(idt < stack[0].idt){
					res += `</li></${stack[0].type}>\n${' '.repeat(idt+2)}<li>${text}`;

					foo.push(`</li>`);
					foo.push(`</${stack[0].type}>`);



					// foo.push(`<li>`);
					// foo.push(text);

					stack.shift();
				}

				foo.push(`${' '.repeat(idt+2)}<li>`);
				foo.push(`${' '.repeat(idt+2)}${text}`);
			});

			res += `</li>\n</${stack[0].type}>`;
			foo.push(`</li>`);
			foo.push(`</${stack[0].type}>`);

			console.log(res)
			console.log(foo)
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
});


const Paragraph = (text)=>{
	return text.split('\n\n').map(chunk=>{
		let divBlock = chunk.startsWith('{{') || chunk.endsWith('}}');
		return `${divBlock?'':'<p>'}${inline(chunk)}${divBlock?'':'</p>'}`
	}).join('\n\n')
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

const trnp = ()=>['META', true];

const extractMeta = (text)=>{
	let meta;
	if(text.startsWith('---')){
		const idx = text.indexOf('---', 4);
		meta = trnp(text.substring(3,idx));
		text = text.substring(idx+3);
	}
	return {meta, text};
};

const sanatizeHTML = (text)=>text.replace(/</g, '&lt;').replace(/>/g, '&gt;');



const md = (str, opts={})=>{
	opts = {allowHTML: false, meta:null, ...opts};
	let {text, meta} = extractMeta(str);
	if(!opts.allowHTML) text = sanatizeHTML(text);

	const html = blockparse(Rules, text, Paragraph).join('\n\n');

	if(opts.meta || (opts.meta!==false && meta)) return {meta, html}
	return html;
}


/*
let res = md(`---
I AM META DATA
---
just some text on the top

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


<div> this is some html </div>

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

{{red


with a starting div}}

and just some rando text

okay cool! }}

`, {allowHTML: true, meta :false});
*/
let res = md(`

- a simple
  - unordered _list_
    - okay!
- yo


`, {allowHTML: true, meta :false});


//console.log(res)