/* Just the inline parser for easy copy-and-paste */

const md = (()=>{
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
	return (str)=>{
		let codetags = [];
		return InlineRules.reduce((acc, [rgx, fn])=>acc.replace(rgx, fn),
				str.trim().replace(wrap('`'), (_,a)=>{codetags.push(a);return '¸';}))
			.replace(/¸/g, ()=>`<code>${codetags.shift()}</code>`);
	};
})();