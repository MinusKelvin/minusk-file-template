const path = require("path")
const fs = require("fs-plus")
const helper = require("./helper")

function replaceFlags(param, flags) {
	if (param == undefined || param == "")
		return ""
	var split = param.split(param[0])
	if (split.length < 4)
		return ""
	var search = new RegExp(split[1], flags)
	var replace = split[2]
	split.splice(0, 3)
	return split.join(param[0]).replace(search, replace)
}

var builtin = {
	"": () => "$",
	"}": () => "}",
	"\\n": () => "\n",
	"timestamp": require("./macros/timestamp"),
	"filename": (ctx) => path.basename(ctx.path, path.extname(ctx.path)),
	"extension": (ctx) => path.extname(ctx.path),
	"path": (ctx) => ctx.path,
	"projectPath": (ctx) => ctx.projectPath,
	"templatePath": (ctx) => ctx.templatePath,
	"getProjectPath": (ctx, p) => {
		if (p == undefined)
			return ctx.projectDir
		return path.join(ctx.projectDir, p)
	},
	"getTemplatePath": (_, p) => {
		if (p == undefined)
			return helper.getTemplateFolder()
		return path.join(helper.getTemplateFolder(), p)
	},
	"getHomePath": (_, p) => {
		if (p == undefined)
			return fs.getHomeDirectory()
		return path.join(fs.getHomeDirectory(), p)
	},
	"includeFile": (_, p) => {
		if (fs.isFileSync(p))
			return fs.readFileSync(p, "utf8")
		return ""
	},
	"replace": (_, param) => replaceFlags(param, "g"),
	"replaceMultiline": (_, param) => replaceFlags(param, "gm")
}

module.exports = (name) => {
	if (builtin[name])
		return builtin[name]
	if (typeof process.minuskFileTemplateMacros == "object" &&
			typeof process.minuskFileTemplateMacros[name] == "function")
		return process.minuskFileTemplateMacros[name]
	return () => "MACRO ERROR No macro with name '"+name+"'"
}
