const fs = require('fs-plus');
const resolveMacro = require("./macros")

module.exports = (context, template) => {
	var index = 0

	var out = ""
	while (hasNext()) {
		var c = getchar()
		if (c == "$")
			out += parseMacro()
		else
			out += c
	}

	return out

	function hasNext() {
		return index < template.length
	}

	function getchar() {
		return template[index++]
	}

	function ungetchar() {
		index--
	}

	// Index points after "$"
	function parseMacro() {
		var macroName = parseName()
		if (!hasNext())
			return "$"+macroName
		var c = getchar()
		if (c == "$")
			return runMacro(macroName)
		// c == "{"
		return runMacro(macroName, parseParameter())
	}

	// Index points after "$"
	function parseName() {
		var name = ""
		while (hasNext()) {
			var c = getchar()
			if (c == "$" || c == "{") {
				ungetchar()
				return name
			}
			name += c
		}
		// EOF
		return name
	}

	// Index points after "{"
	function parseParameter() {
		var value = ""
		while (hasNext()) {
			var c = getchar()
			if (c == "}")
				break
			if (c == "$")
				value += parseMacro()
			else
				value += c
		}
		return value
	}

	function runMacro(name, parameter) {
		return resolveMacro(name)(context, parameter)
	}
}
