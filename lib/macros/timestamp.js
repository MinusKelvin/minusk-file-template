module.exports = (context, parameter) => {
	if (parameter == undefined)
		parameter = "%Y-%m-%dT%H:%M:S%z"
	return "'"+parameter+"'" // TODO
}
