# minusk-file-template

Generate new files from templates. Work in progress.

## Usage

- Minusk File Template: New File From Template
- `WIP` Minusk File Template: New Template
- `WIP` Minusk File Template: Edit Template
- `NYI` Minusk File Template: Delete Template
- `NYI` Minusk File Template: Open Template Folder

## Macros

Macros dynamically insert text into the generated file.

Macros have 2 forms: `$macro_name$` and `$macro_name{parameter}`. The macro name can contain any characters except `$`, `{`, and `}`. The parameter can contain macros. If the end of the template is reached

### Built-in Macros

Name              | Description
----              | -----------
empty string      | Resolves to `$`.
`}`               | Resolves to `}`.
`\n`              | Resolves to a newline.
`timestamp`       | Formats the file's timestamp using the parameter as a [format string](#timestamp_format_string). Default format is ISO 8601. `WIP`
`filename`        | Resolves to the name of the file, without the extension.
`extension`       | Resolves to the file extension.
`path`            | Resolves to the absolute path of the file.
`projectPath`     | Resolves to the relative path to the file from the project directory.
`templatePath`    | Resolves to the absolute path of the template.
`getProjectPath`  | Joins the project directory path and the parameter path.
`getTemplatePath` | Joins the template directory path and the parameter path.
`getHomePath`     | Joins the user home directory path and the parameter path.
`includeFile`     | Inserts a file, using the parameter as a path. Does nothing if the path does not refer to a file. You might want to get a path using one of the `get*Path` macros.
`replace`         | Given a parameter of the form `/search/replace/content`, is equivalent to `content.replace(new RegExp(search,"g"), replace)`. The first character specifies the delimiter and it cannot be escaped. If there are not at least 3 occurrences of the delimiter, the macro resolves to the empty string.
`replaceMultiline`| Same as `replace` but uses `gm` as the regex flags.

### Defining Your Own Macros

A macro is a function that takes a context object and a parameter, and returns a string.

The context object has 5 fields:
- `timestamp`, a `Date` containing when the file was created.
- `path`, a string containing the absolute path to the file.
- `projectDir`, a string containing the absolute path to the project directory.
- `projectPath`, a string containing the relative path to the file in the project.
- `templatePath`, a string containing the absolute path to the template file.

The parameter is either a string (`$macro_name{parameter}` form), or `undefined` (`$macro_name$` form)

```javascript
process.minuskFileTemplateMacros = {
  "macro_name": (context, parameter) => {
    return macroValue
  }
}
```

## Config

The only config option is the location of your templates directory. If it is a relative path, it is considered realtive to your .atom directory. By default it is `minusk-file-template`

## Other

### Timestamp Format String

TODO
