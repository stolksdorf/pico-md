const reduce = (obj,fn,init)=>Object.keys(obj).reduce((acc, key, idx)=>{return fn(acc, obj[key], key, idx); }, init);

//TODO: add in a diagnostics mode
// Side steps the rendering outputs an object to help you with matching

const engine = (rules, input)=>{
	if(!input) return '';
	const ruleMatch = reduce(rules, (bestMatch, rule, id)=>{
		if(id == 'default') return bestMatch;
		const match = rule.regex.exec(input);
		if(!match) return bestMatch;
		match.id = id;
		if(!bestMatch) return match;
		if(bestMatch.index > match.index) return match;
		return bestMatch;
	}, null);

	if(!ruleMatch) return rules.default ? rules.default(input) : input;

	return input.substring(0, ruleMatch.index)
		+ rules[ruleMatch.id].render(...match)
		+ engine(rules, input.substring(ruleMatch[0].length + ruleMatch.index))

};

module.exports = engine;