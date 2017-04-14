const fs   = require('fs-plus')
const path = require('path')
const a    = require("atom")
const TextEditor = a.TextEditor

const Dialog = require("./dialog")
const helper = require('./helper');
const runTemplate = require("./run-template")

module.exports = function() {
	var tView = atom.packages.getActivePackage("tree-view").mainModule.createView()
	var selectedEntry = tView.selectedEntry() ? tView.selectedEntry() : tView.roots[0];
	var selectedPath = selectedEntry ? selectedEntry.getPath() ? selectedEntry.getPath() : "" : ""

	var dirPath
	if (fs.isFileSync(selectedPath))
		dirPath = path.dirname(selectedPath)
	else
		dirPath = selectedPath

	var ary = atom.project.relativizePath(dirPath)
	var projectPath = ary[0]
	dirPath = ary[1]
	if (dirPath.length > 0)
		dirPath += path.sep

	var dialog = new Dialog()
	var filePrompt = dialog.addPrompt("Enter the path for the new file.", dirPath)
	var templatePrompt = dialog.addTemplateSearch()
	dialog.onConfirm = () => {
		var selectedTemplate = templatePrompt.getSelectedItem()
		if (!selectedTemplate) {
			templatePrompt.update({errorMessage: "No template selected"})
			return
		}
		var enteredPath = filePrompt.editor.getText()
		var result = helper.tryCreateFile(enteredPath, projectPath)
		if (result.err) {
			filePrompt.showError(result.err)
		} else {
			dialog.close()
			var context = {}
			helper.readOnlyProperty(context, "timestamp", new Date)
			helper.readOnlyProperty(context, "path", result.path)
			helper.readOnlyProperty(context, "projectDir", projectPath)
			helper.readOnlyProperty(context, "projectPath", enteredPath)
			fs.writeFileSync(result.path, runTemplate(
				context, fs.readFileSync(selectedTemplate.path, "utf8")
			), {flag: "wx"})
			atom.workspace.open(result.path)
		}
	}
	dialog.show()
}
