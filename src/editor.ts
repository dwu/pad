import { CommandPalette } from "./command-palette"

import { indentWithTab } from "@codemirror/commands"
import { Compartment } from "@codemirror/state"
import { keymap } from "@codemirror/view"
import { EditorView, basicSetup } from "codemirror"

export class Editor {

    lineWrapping: boolean
    editorElement: HTMLElement
    editorView: EditorView
    commandPalette?: CommandPalette

    constructor() {
        this.lineWrapping = false
        this.editorElement = document.querySelector<HTMLElement>(".editor")!

        const lineWrappingCompartment = new Compartment()
        const editorExtensions = [
            basicSetup,
            keymap.of([
                {
                    key: "Ctrl-l", preventDefault: true, run: () => {
                        this.lineWrapping = !this.lineWrapping
                        this.editorView.dispatch({
                            effects: lineWrappingCompartment.reconfigure(this.lineWrapping ? EditorView.lineWrapping : [])
                        })
                        return true
                    },
                },
                {
                    key: "Ctrl-e", preventDefault: true, run: () => {
                        this.editorView.dispatch({
                            changes: { from: 0, to: this.editorView.state.doc.toString().length, insert: "" }
                        })
                        return true
                    },
                },
                {
                    key: "Ctrl-k", preventDefault: true, run: () => {
                        this.commandPalette?.show(this.editorView, 250)
                        return true
                    },
                },
                indentWithTab
            ]),
            lineWrappingCompartment.of(this.lineWrapping ? EditorView.lineWrapping : []),
        ]

        this.editorView = new EditorView({
            extensions: editorExtensions,
            parent: this.editorElement,
        })
    }

    focus() {
        this.editorView.focus()
    }

    applyFilter(filterFn: (text: string) => string) {
        // don't apply filters on multiple selections
        if (this.editorView.state.selection.ranges.length > 1)
            return

        // select all if nothing selected
        if (this.editorView.state.selection.ranges.length == 1 &&
            this.editorView.state.selection.ranges[0].from == this.editorView.state.selection.ranges[0].to) {
            this.editorView.dispatch(this.editorView.state.update({ selection: { anchor: 0, head: this.editorView.state.doc.length }, userEvent: "select" }))
        }

        this.editorView.state.selection.ranges.forEach((range) => {
            const selectedText = this.editorView.state.sliceDoc(
                range.from,
                range.to)

            let replacement: string = filterFn(selectedText)
            this.editorView.dispatch(this.editorView.state.replaceSelection(replacement))
        })
    }

}

