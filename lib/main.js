const newFile = require('./new-file')
const newTemplate = require("./new-template")
const editTemplate = require("./edit-template")
const CompositeDisposable = require("atom").CompositeDisposable
const path = require("path")
const fs = require("fs-plus")

module.exports = {
	activate(state) {
		this.subscriptions = new CompositeDisposable()

		this.subscriptions.add(atom.commands.add('atom-workspace', {
			"minusk-file-template:new-file-from-template": newFile,
			"minusk-file-template:new-template": newTemplate,
			"minusk-file-template:edit-template": editTemplate
		}));

		if (!fs.isDirectorySync(atom.config.get("minusk-file-template.templateDirectory"))) {
			fs.makeTreeSync(atom.config.get("minusk-file-template.templateDirectory"))
		}
	},

	deactivate() {
		this.subscriptions.dispose()
	},

	config: {
		templateDirectory: {
			description: "Path to the folder containing template files. Relative to your .atom directory.",
			type: "string",
			default: "minusk-file-template"
		}
	}
};
