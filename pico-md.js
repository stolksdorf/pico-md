const Marked = require('marked');
const renderer = new Marked.Renderer();
const yaml = require('js-yaml').safeLoad;

const extensions = {
	paragraph : (text)=>{
		const res = text
			.replace(
				///:{3,}([^:\n]+):{3,}(\n|$)/g,
				/:{3,}([^:\n]+).*(\n|$)/g,
				(raw,classes)=>`<div class='${classes.trim()}'>\n`)
			.replace(/:{3,}(\n|$)/g, (text)=>`</div>`)

		if(res.startsWith('<div') && res.endsWith('</div>')) return res;
		return `<p>${res}</p>`;
	},

	image : (href, title, text)=>{
		if (href === null) return text;
		title = title ? `title="${title}` : '';
		return `<img src="${href}"" alt="${text}" class="${text}" ${title} />`;
	},
};

const extractMetadata = (content)=>{
	let meta, md = content.trim();
	const endIdx = md.indexOf('---\n', 5);
	if(endIdx !== -1 && content.substring(0,4) === '---\n'){
		meta = yaml(md.substring(4, endIdx));
		md   = md.substring(endIdx + 4);
	}
	return {md, meta};
};

module.exports = (content, opts={})=>{
	const {md, meta} = extractMetadata(content);
	let result = Marked(md, {
		renderer : Object.assign(renderer, extensions, opts.renderer),
		sanitize : !opts.allowHtml,
	});
	if(meta){
		result = new String(result);
		result.meta = meta;
		return result;
	}
	return result;
}
