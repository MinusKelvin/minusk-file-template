const path = require("path")

var builtin = {
	"": () => "$",
	"}": () => "}",
	"timestamp": require("./macros/timestamp"),
	"filename": (ctx) => path.basename(ctx.path, path.extname(ctx.path)),
	"extension": (ctx) => path.extname(ctx.path),
	"path": (ctx) => ctx.path,
	"projectDir": (ctx) => ctx.projectDir,
	"projectPath": (ctx) => ctx.projectPath
}

module.exports = (name) => {
	if (builtin[name])
		return builtin[name]
	if (typeof process.minuskFileTemplateMacros == "object" &&
			typeof process.minuskFileTemplateMacros[name] == "function")
		return process.minuskFileTemplateMacros[name]
	return () => "MACRO ERROR No macro with name '"+name+"'"
}
