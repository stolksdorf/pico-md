const minidown = (str)=>{
	return Object.entries({
		'(#+)(.*)' : (_,{length},a) =>`<h${length}>${a.trim()}</h${length}>`,
		'!\\[([^\\]]*)\\]\\((.*?)\\)':(_,a,b) => `<img alt='${a}' src='${b}'></img>`,
		'\\[([^\\]]+)\\]\\((.*?)\\)':(_,a,b) => `<a href='${b}'>${a}</a>`,
		'\n-{3,}':()=>`\n<hr />`,
		'`(.*?)`' : (_,a)=>`<code>${a}</code>`,
		'\\*(.*?)\\*' : (_,a)=>`<strong>${a}</strong>`,
		'_(.*?)_' : (_,a)=>`<em>${a}</em>`,
		'~~(.*?)~~' : (_,a)=>`<del>${a}</del>`,
		'\n(&gt;|\>)(.*)' : (_,a,b)=>`<blockquote>${b.trim()}</blockquote>`,
		'<\/blockquote><blockquote>': ()=>'\n',
		'\n\-(.*)' : (_,a)=>`<ul>\n\t<li>${a.trim()}</li>\n</ul>`,
		'\n<\/ul>\s?<ul>': ()=>'',
		'\n[0-9]+\.(.*)' : (_,a)=>`<ol>\n\t<li>${a.trim()}</li>\n</ol>`,
		'\n<\/ol>\s?<ol>': ()=>'',
	}).reduce((acc, [rx, func])=>acc.replace(new RegExp(rx, 'g'), func), str);
};
