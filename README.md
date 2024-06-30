Web-based text pad with functions for

- encoding and decoding (base64, URI, JWT decode, ...)
- text manipulation (whitespace modification, line operations, ...)
- formatting (JSON, XML, SQL, ...)
- conversion

Live instance at: http://dwu.github.io/pad

**All functions are executed client-side in the browser.**

Notes:
- Functions can either be run by choosing them from the sidebar menu or via a command palette (`Ctrl-k`)
- If there is a selection the function is applied to the selected text; applying filters to multiple selections is not supported
- If there are no selections the function is applied to the complete text
- `Ctrl-l`: Toggle line wrapping
- `Ctrl-e`: Empty pad
