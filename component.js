const React    = require('react');
const md = require('./pico-md.js');

const Markdown = ({ content, children, className, ...props})=>{
	const __html = md(content || children, { renderer })
	return React.createElement('div', {
		className : `Markdown ${className}`,
		dangerouslySetInnerHTML : {__html},
		...props
	})
}

module.exports = Markdown;