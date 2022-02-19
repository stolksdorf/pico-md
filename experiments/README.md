# Markdown Engine

This is an experiemntal markdown engine using recursive regex matching.

It's primary goal is to be an incredibly extenible and flexible markdown engine, using simple matching and rendering methods.



### Engine
The core engine is a agnostic string processor that takes in a grammar ruleset and a string, then outputs the process string.

The grammar is a series of matching regexes and a function describing how to render that match. Any capturing groups in the regex are passed as parameters to the render function.

The engine loops over each of the rules to see if they match the current input. It selects the rule that matched the earliest in the input string, processes the render method on the rule, and then calls itself with the new input and loops again. If no rule matches, it runs the `default` rule on the input (if one is provided) and then returns the resulting string.

The real power of this approach is when the rendering methods for a match recursively call the engine on it's contents.

When you create multiple grammar sets, the render methods can effectively do "state-switching" by calling the engine on it's contents with different grammar. A great example of this is writing a markdown grammar that matches on the table syntax, but then sends that to a dedciated table grammar, which then refernces the inline grammar set.


### Ideas

- PHP regex based markdown parser: https://gist.github.com/jbroadway/2836900