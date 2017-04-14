const fs = require("fs-plus")
const path = require("path")
const helper = {
	tryCreateFile(fpath, projectPath) {
		var fpath = fpath.replace("/\s/+$/","")
		if (fpath[fpath.length - 1] === path.sep)
			return {err: "File names must not end with a '"+path.sep+"' character"}
		if (!path.isAbsolute(fpath)) {
			if (projectPath == null)
				return {err: "You must open a directory to create a file with a relative path"}
			fpath = path.join(projectPath, fpath)
		}

		if (!fpath)
			return {err: ""}

		try {
			if (fs.existsSync(fpath))
				return {err: fpath+" already exists."}
			return {
				path: fpath
			}
		} catch (err) {
			return {err: err.message}
		}
	},

	getTemplateFolder() {
		var tpath = atom.config.get("minusk-file-template.templateDirectory")
		if (path.isAbsolute(tpath))
			return tpath
		return path.join(atom.getConfigDirPath(), tpath)
	},

	getTemplateList() {
		var tpath = helper.getTemplateFolder()
		var paths = fs.listTreeSync(tpath)
		var templates = []
		for (var i = 0; i < paths.length; i++) {
			var p = paths[i]
			if (fs.isFileSync(p) && p.endsWith(".template")) {
				templates.push({
					path: p,
					name: path.relative(tpath, p).slice(0,-9)
				})
			}
		}
		return templates
	},

	highlight(putElement, text, matches) {
		if (text === "")
			return
		var t = text[0]
		var highlight = matches[0] == 0
		var nextMatchIndex = matches[0] == 0 ? 1 : 0
		for (var i = 1; i < text.length; i++) {
			if (highlight) {
				if (matches[nextMatchIndex] != i) {
					var span = document.createElement("span")
					span.classList.add("character-match")
					span.textContent = t
					putElement.appendChild(span)
					t = text[i]
					highlight = false
				} else {
					t += text[i]
					nextMatchIndex++
				}
			} else {
				if (matches[nextMatchIndex] == i) {
					putElement.appendChild(document.createTextNode(t))
					t = text[i]
					highlight = true
					nextMatchIndex++
				} else {
					t += text[i]
				}
			}
		}
		if (highlight) {
			var span = document.createElement("span")
			span.classList.add("character-match")
			span.textContent = t
			putElement.appendChild(span)
		} else {
			putElement.appendChild(document.createTextNode(t))
		}
	},

	readOnlyProperty(obj, key, value) {
		Object.defineProperty(obj, key, {
			value: value,
			writable: false,
			enumerable: true,
			configurable: true
		})
	}
}

module.exports = helper
