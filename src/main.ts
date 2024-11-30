import "./style.css"

import { FilterAction } from "./filter-action.ts"
import { InsertAction } from "./insert-action.ts"
import { CommandPalette } from "./command-palette.ts"
import { Editor } from "./editor.ts"
import { compactBlanks, epochConvert, htmlDecode, htmlEncode, insertBlanksAfterNCharacters, removeBackslashes, removeBlanks, joinLines, removeLinebreaks, blanksToLinebreaks, trimLines } from "./filter-action.ts"

import { css, cssmin, json, jsonmin, sqlmin, xml, xmlmin } from "vkbeautify"
import { jwtDecode } from "jwt-decode"
import { format as sqlformat } from "sql-formatter"

const INDENT = 2;

const actions = [
    // Encoding
    new FilterAction({
        elementId: "encode-base64",
        sectionTitle: "Encoding",
        actionTitle: "Encode base64",
        filterFn: btoa
    }),
    new FilterAction({
        elementId: "decode-base64",
        sectionTitle: "Encoding",
        actionTitle: "Decode base64",
        filterFn: atob
    }),
    new FilterAction({
        elementId: "encode-uri",
        sectionTitle: "Encoding",
        actionTitle: "Encode URI",
        filterFn: encodeURI
    }),
    new FilterAction({
        elementId: "decode-uri",
        sectionTitle: "Encoding",
        actionTitle: "Decode URI",
        filterFn: decodeURI
    }),
    new FilterAction({
        elementId: "encode-html",
        sectionTitle: "Encoding",
        actionTitle: "Encode HTML",
        filterFn: htmlEncode
    }),
    new FilterAction({
        elementId: "decode-html",
        sectionTitle: "Encoding",
        actionTitle: "Decode HTML",
        filterFn: htmlDecode
    }),
    new FilterAction({
        elementId: "decode-jwt",
        sectionTitle: "Encoding",
        actionTitle: "Decode JWT",
        filterFn: (text: string) => {
            try {
                return json(JSON.stringify(jwtDecode(text)), INDENT)
            } catch (error: any) {
                return `ERROR: ${error.message}\n\nOriginal:\n\n${text}`;
            }
        }
    }),

    // Text
    new FilterAction({
        elementId: "text-join-lines",
        sectionTitle: "Text",
        actionTitle: "Join lines",
        filterFn: joinLines
    }),
    new FilterAction({
        elementId: "text-remove-eol",
        sectionTitle: "Text",
        actionTitle: "Remove line breaks",
        filterFn: removeLinebreaks
    }),
    new FilterAction({
        elementId: "text-blanks-to-nl",
        sectionTitle: "Text",
        actionTitle: "Blanks to line breaks",
        filterFn: blanksToLinebreaks
    }),
    new FilterAction({
        elementId: "text-trim-lines",
        sectionTitle: "Text",
        actionTitle: "Trim lines",
        filterFn: trimLines
    }),
    new FilterAction({
        elementId: "text-remove-blanks",
        sectionTitle: "Text",
        actionTitle: "Remove blanks",
        filterFn: removeBlanks
    }),
    new FilterAction({
        elementId: "text-compact-blanks",
        sectionTitle: "Text",
        actionTitle: "Compact blanks",
        filterFn: compactBlanks
    }),
    new FilterAction({
        elementId: "text-remove-backslashes",
        sectionTitle: "Text",
        actionTitle: "Remove backslashes",
        filterFn: removeBackslashes
    }),
    new FilterAction({
        elementId: "text-insert-blank-2",
        sectionTitle: "Text",
        actionTitle: "Insert blanks (2)",
        filterFn: (text: string) => { return insertBlanksAfterNCharacters(text, 2) }
    }),
    new FilterAction({
        elementId: "text-insert-blank-4",
        sectionTitle: "Text",
        actionTitle: "Insert blanks (4)",
        filterFn: (text: string) => { return insertBlanksAfterNCharacters(text, 4) }
    }),
    new FilterAction({
        elementId: "text-insert-blank-8",
        sectionTitle: "Text",
        actionTitle: "Insert blanks (8)",
        filterFn: (text: string) => { return insertBlanksAfterNCharacters(text, 8) }
    }),

    // Format
    new FilterAction({
        elementId: "format-json",
        sectionTitle: "Format",
        actionTitle: "Format JSON",
        filterFn: (text: string) => { return json(text, 2) }
    }),
    new FilterAction({
        elementId: "format-xml",
        sectionTitle: "Format",
        actionTitle: "Format XML",
        filterFn: (text: string) => { return xml(text, 2) }
    }),
    new FilterAction({
        elementId: "format-sql",
        sectionTitle: "Format",
        actionTitle: "Format SQL",
        filterFn: (text: string) => { return sqlformat(text, { "tabWidth": INDENT }) }
    }),
    new FilterAction({
        elementId: "format-CSS",
        sectionTitle: "Format",
        actionTitle: "Format CSS",
        filterFn: (text: string) => { return css(text, 2) }
    }),

    // Format
    new FilterAction({
        elementId: "minify-json",
        sectionTitle: "Minify",
        actionTitle: "Minify JSON",
        filterFn: jsonmin
    }),
    new FilterAction({
        elementId: "minify-xml",
        sectionTitle: "Minify",
        actionTitle: "Minify XML",
        filterFn: xmlmin
    }),
    new FilterAction({
        elementId: "minify-sql",
        sectionTitle: "Minify",
        actionTitle: "Minify SQL",
        filterFn: sqlmin
    }),
    new FilterAction({
        elementId: "minify-css",
        sectionTitle: "Minify",
        actionTitle: "Minify CSS",
        filterFn: cssmin
    }),

    // Convert
    new FilterAction({
        elementId: "convert-epoch-local",
        sectionTitle: "Convert",
        actionTitle: "Convert Epoch -> Localtime",
        filterFn: epochConvert
    }),

    // Insert UUID
    new InsertAction({
        elementId: "insert-uuid",
        sectionTitle: "Insert",
        actionTitle: "Insert UUIDv4",
        insertFn: () => { return crypto.randomUUID() }
    }),
]

const editor = new Editor()
const commandPalette = new CommandPalette(actions, editor)
editor.commandPalette = commandPalette

editor.focus()

const sidenav: Element = document.getElementsByClassName("sidenav")![0]
let currentSectionTitle: string = ""
let currentPanel: HTMLDivElement
actions.forEach((action) => {
    if (currentPanel == null || currentSectionTitle != action.sectionTitle) {
        const section = document.createElement("button")
        section.classList.add("accordion")
        section.innerText = action.sectionTitle
        sidenav.appendChild(section)
        section.addEventListener("click", function (this: any) {
            this.classList.toggle("active")
            var panel = this.nextElementSibling
            if (panel.style.display === "block") {
                panel.style.display = "none"
            } else {
                panel.style.display = "block"
            }
        })

        currentPanel = document.createElement("div")
        currentPanel.style.display = "none"
        sidenav.appendChild(currentPanel)

        currentSectionTitle = action.sectionTitle
    }

    const button = document.createElement("button")
    button.id = action.elementId
    button.classList.add("accordionitem")
    button.innerText = action.actionTitle
    if (action instanceof FilterAction) {
        button.addEventListener("click", () => editor.applyFilter(action.filterFn))
    } else if (action instanceof InsertAction) {
        button.addEventListener("click", () => editor.insertText(action.insertFn))
    }
    currentPanel.appendChild(button)
})
