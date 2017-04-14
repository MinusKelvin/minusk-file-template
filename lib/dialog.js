const a = require("atom")
const TextEditor = a.TextEditor
const SelectList = require("atom-select-list")
const helper = require("./helper")
const fuzzaldrin = require("fuzzaldrin")

module.exports = class Dialog {
	constructor() {
		this.prompts = []
		this.focusable = []
		this.element = document.createElement("div")
		this.element.classList.add("minusk-file-template")

		var _this = this
		atom.commands.add(this.element, {
			"core:confirm": () => _this.onConfirm(),
			"core:cancel": () => _this.close()
		})
	}

	makeFocusable(elem) {
		var _this = this
		elem.addEventListener("blur", () => window.setTimeout(() => _this.onBlur(), 0))
		elem.tabIndex = this.focusable.length
		this.focusable.push(elem)
	}

	addPrompt(label, initialValue) {
		var element = this.element
		var prompt = {
			label: document.createElement("label"),
			editor: new TextEditor({mini: true}),
			errorMsg: document.createElement("div"),
			showError: (msg) => {
				prompt.errorMsg.textContent = msg
				if (msg) {
					element.classList.add("error")
					window.setTimeout(() => element.classList.remove("error"), 300)
				}
			}
		}
		prompt.label.textContent = label
		element.appendChild(prompt.label)

		this.makeFocusable(prompt.editor.element)
		prompt.editor.onDidChange(() => prompt.showError())
		prompt.editor.setText(initialValue)
		element.appendChild(prompt.editor.element)

		prompt.errorMsg.classList.add("error-message")
		element.appendChild(prompt.errorMsg)

		this.prompts.push(prompt)
		return prompt
	}

	addTemplateSearch(labelText) {
		var label = document.createElement("label")
		label.textContent = labelText
		this.element.appendChild(label)

		var _this = this
		var search = new SelectList({
			items: helper.getTemplateList(),
			filterKeyForItem: (item) => item.name,
			elementForItem: (template) => {
				var li = document.createElement("li")
				if (search)
					helper.highlight(li, template.name, fuzzaldrin.match(template.name, search.getFilterQuery()))
				else
					li.textContent = template.name
				return li
			},
			didCancelSelection: () => {
				if (search.element.firstChild.hasFocus())
					atom.commands.dispatch(_this.element, "core:cancel")
			},
			didConfirmSelection: () => atom.commands.dispatch(_this.element, "core:confirm"),
			didConfirmEmptySelection: () => atom.commands.dispatch(_this.element, "core:confirm"),
			didChangeQuery: () => search.update({errorMessage: null})
		})
		this.makeFocusable(search.element.firstChild)
		this.element.appendChild(search.element)

		return search
	}

	onBlur() {
		for (var i in this.focusable)
			if (this.focusable[i].hasFocus())
				return;
		this.close()
	}

	close() {
		if (this.panel)
			this.panel.destroy()
		this.panel = null
		for (var p in this.prompts)
			this.prompts[p].editor.destroy()
		atom.workspace.getActivePane().activate()
	}

	show() {
		this.panel = atom.workspace.addModalPanel({item: this.element})
		this.prompts[0].editor.element.focus()
		for (var p in this.prompts)
			this.prompts[p].editor.scrollToCursorPosition()
	}
}
