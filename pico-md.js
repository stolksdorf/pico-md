const metaParse = (str)=>{
	let result = {}, lastKey;
	const get = (str)=>{
		if(str==='true')  return true;
		if(str==='false') return false;
		if(/^(-?[\d|_]+(\.[\d|_]+)?)$/.test(str)) return Number(str.replace('_',''));
		return str;
	}
	str.split('\n').map(line=>{
		const [_,key,val] = line.match(/^(\s*[a-z0-9A-Z_]+\s*):(( .*)|(\s*$))/) || [];
		if(key){ lastKey = key.trim(); line = val; }
		line = get(line.trim());
		if(line==='') return;
		if(typeof line !== 'string') return result[lastKey] = line;
		if(line[0] == '-'){
			if(!Array.isArray(result[lastKey])) result[lastKey] = [];
			return result[lastKey].push(get(line.substring(1).trim()));
		}
		result[lastKey] = (typeof result[lastKey] == 'string' ? result[lastKey]+'\n' : '') + line;
	});
	return result;
};

const wrap=(tag)=>new RegExp(`(?<=\\W|^)\\${tag}(.+?)\\${tag}(?=\\W|$)`,'gm');
const InlineRules = [
	[wrap('_'),                  (_,a)=>`<em>${a}</em>`],
	[wrap('*'),                  (_,a)=>`<strong>${a}</strong>`],
	[wrap('~~'),                 (_,a)=>`<del>${a}</del>`],
	[/!\[([^\]]*)\]\((.*?)\)/gm, (_,a,b) => `<img alt='${a}' src='${b}'></img>`],
	[/\[([^\]]+)\]\((.*?)\)/gm,  (_,a,b) => `<a href='${b}'>${a}</a>`],
	[/(?<=\W|^){{([\w,]+)\s*/gm, (_,a)=>`<div${a?` class="${a.replace(/,/g, " ")}"`:''}>`],
	[/}}(?=\W|$)/gm,             ()=>`</div>`],
];
const inline = (str)=>{
	let codetags = [];
	return md.inlineRules.reduce((acc, [rgx, fn])=>acc.replace(rgx, fn),
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
		const pre = remaining.substring(0,match.index).trim();
		if(fallback && pre) result.push(fallback(pre));
		result.push(match.func(...match));
		remaining = remaining.substring(match.index + match[0].length);
	}
	remaining = remaining.trim();
	if(fallback && remaining) result.push(fallback(remaining));
	return result;
};


const BlockRules = Object.values({
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
	TableWithAlignmnet : [/(^\|(.*)\|\n?)(^\|[\|\-: ]+\|\n?)(^\|(.*)\|\n?)+/m,
		(text)=>{
			let [headers, align, ...rows] = text.trim().split('\n').map(line=>line.slice(1,-1).split('|'));

			align = align.map(cell=>{
				if(/\s*:-{3,}:\s*/.test(cell)) return 'center';
				if(/\s*-{3,}:\s*/.test(cell)) return 'right';
				return '';
			});

			const getAlignment = (idx)=>align[idx]?` align="${align[idx]}"`:'';
			const head = headers.map((h,idx)=>`\t\t<th${getAlignment(idx)}>${inline(h)}</th>`).join('\n');
			const body = rows.map(line=>{
				return `\t\t<tr>\n${line.map((cell,idx)=>`\t\t\t<td${getAlignment(idx)}>${inline(cell)}</td>`).join('\n')}\n\t\t</tr>`
			}).join('\n');
			return `<table>\n\t<thead><tr>\n${head}\n\t</tr></thead>\n\t<tbody>\n${body}\n\t</tbody>\n</table>`
		}
	],
	SimpleTable : [/(^\|(.*)\|\n?)+/m,
		(text)=>{
			let lines = text.trim().split('\n').map(line=>line.slice(1,-1).split('|'));
			return `<table>\n${lines.map(line=>{
				return `\t<tr>\n${line.map(cell=>`\t\t<td>${inline(cell)}</td>`).join('\n')}\n\t</tr>`
			}).join('\n')}\n</table>`;
		}
	],
	List : [/(^[ \t]*([0-9]+\.|-)(.*)\n?){2,}/m,
		(text)=>{
			let stack = [];
			let tokens = text.trim().split('\n').reduce((acc,line)=>{
				let [_, idt, sym, text] = /(\s*)(-|[0-9]+\.) ?(.*)/.exec(line);
				sym = sym.replace('.', '');
				let type = sym=='-'?'ul':'ol';
				idt = idt.length;
				if(!stack[0] || idt > stack[0].idt){
					acc.pop();
					acc.push((type=='ol'&&sym!=='1')
						? `<ol start="${sym}">`
						:`<${type}>`);
					stack.unshift({type, idt});
				}else if(idt < stack[0].idt){
					while(idt < stack[0].idt){
						acc = acc.concat([`</${stack[0].type}>`, '</li>']);
						stack.shift();
					}
				}
				return acc.concat([`<li>`, inline(text), '</li>']);
			}, []);
			stack.map(({type})=>tokens = tokens.concat([`</${stack[0].type}>`, `</li>`]));
			tokens.pop();

			let depth = 0, result='';
			tokens.map(token=>{
				if(/<\/(ul|li|ol)/.test(token)) depth -=1;
				result += `${'\t'.repeat(depth)}${token}\n`;
				if(/<(ul|li|ol)/.test(token)) depth +=1;
			});
			return result;
		}
	],
});

const Paragraph = (text)=>{
	return text.split('\n\n').map(chunk=>{
		let divBlock = chunk.startsWith('{{') || chunk.endsWith('}}');
		return `${divBlock?'':'<p>'}${inline(chunk)}${divBlock?'':'</p>'}`
	}).join('\n\n')
};

const extractMeta = (text)=>{
	let meta;
	if(text.startsWith('---')){
		const idx = text.indexOf('---', 4);
		meta = metaParse(text.substring(3,idx));
		text = text.substring(idx+3);
	}
	return {meta, text};
};

const sanatizeHTML = (text)=>text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

const md = (str, opts={})=>{
	opts = {allowHTML:false, meta:null, ...opts};
	let {text, meta} = extractMeta(str);
	if(!opts.allowHTML) text = sanatizeHTML(text);

	const html = blockparse(md.blockRules, text, Paragraph).join('\n\n');

	if(opts.meta || (opts.meta!==false && meta)) return {meta, html};
	return html;
}

md.inline = inline;
md.blockRules = BlockRules;
md.inlineRules = InlineRules;

module.exports = md;