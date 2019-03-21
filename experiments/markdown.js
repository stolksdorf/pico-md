const engine = require('./engine.js');

const snakeCase = (text)=>text.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s/g, '_');


const blockRules = {
	code : {
		regex : /```\n([^```]+)\n```/,
		render : (lines, code)=>`<pre><code>${code}</code></pre>`
	},
	// blocks : {
	// 	regex : /\{\{([a-zA-Z0-9_,]*| )([^\}\}]+)\}\}/,
	// 	render: (line, classes, content)=>{
	// 		return `<div class='${classes.replace(/,/g, ' ')}'>${block(content)}</div>`;
	// 	}
	// },

	fence : {
			//regex : /\{\{([a-zA-Z0-9_,]*| )([^\}\}]+)\}\}/,
			regex : /:{3,}([^:\n]+)[:*]\n([^:]+):{3,}/
			render: (line, classes, content)=>{
				return `<div class='${classes.replace(/,/g, ' ')}'>${block(content)}</div>`;
			}
	},

	headers : {
		regex : /\n*(#{1,6}) (.+)(\n|$)/,
		render: (line, marks, text)=>{
			return `<h${marks.length} id='${snakeCase(text)}'>${inline(text)}</h${marks.length}>`;
		}
	},
	unorderedlist : {
		regex : /(\- (.+)(\n|$))+/,
		render : (lines, a, b, c)=>{
			const items = lines.split('\n')
				.map((line)=>`<li>${inline(line.replace('- ', ''))}</li>`)
				.join('\n')
			return `<ul>${items}</ul>`
		}
	},
	orderedlist : {
		regex : /(\d+\. (.+)(\n|$))+/,
		render : (lines, a, b, c)=>{
			const items = lines.split('\n')
				.map((line)=>`<li>${inline(line.split('.')[1])}</li>`)
				.join('\n')
			return `<ol>${items}</ol>`
		}
	},
	default : (text)=>(text?`<p>${inline(text)}</p>`:'')
};

const inlineRules = {
	code : {
		regex : /`([^`]+)`/,
		render: (line, text)=>`<code>${text}</code>`
	},
	italics : {
		regex : /_(.+?)_/,
		render: (line, text)=>`<em>${inline(text)}</em>`
	},
	// bold : {
	// 	regex : /\*(.+?)\*/,
	// 	render: (line, text)=>`<strong>${inline(text)}</strong>`
	// },
	sup : {
		regex : /\^(.+?)\^/,
		render: (line, text)=>`<sup>${inline(text)}</sup>`
	},
	image : {
		regex : /\!\[([^\[]+)\]\(([^\)]+)\)/,
		render: (line, text, link)=>`<img class='${text}' alt='${text}' src='${link}' />`
	},
	hyperlink : {
		regex : /\[([^\[]+)\]\(([^\)]+)\)/,
		render: (line, text, link)=>`<a href='${link}'>${inline(text)}</a>`
	},
};

const block = (md)=>engine(blockRules, md);
const inline = (md)=>engine(inlineRules, md);

module.exports = block;

