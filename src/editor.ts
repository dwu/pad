import { CommandPalette } from "./command-palette"
import { Storage } from "./storage"

import { indentWithTab } from "@codemirror/commands"
import { Compartment } from "@codemirror/state"
import { keymap } from "@codemirror/view"
import { EditorView, basicSetup } from "codemirror"

export class Editor {

    lineWrapping: boolean
    editorElement: HTMLElement
    editorView: EditorView
    storage?: Storage
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

        if (window.localStorage) {
            // store content on pagehide and restore when opened
            let unloadEvent: string
            if ('onpagehide' in window) {
                unloadEvent = 'pagehide';
            } else {
                unloadEvent = 'beforeunload';
            }

            this.storage = new Storage()
            let text = this.storage.get();
            if (text) {
                this.setText(text);
            }
            window.addEventListener(unloadEvent, () => {
                this.storage?.set(this.getText())
            })
        }
    }

    focus() {
        this.editorView.focus()
    }

    insertText(insertFn: () => string) {
        // don't apply filters on multiple selections
        if (this.editorView.state.selection.ranges.length > 1)
            return

        const insertedText = insertFn()
        this.editorView.dispatch({ changes: { from: this.editorView.state.selection.ranges[0].from, insert: insertedText } })
        this.editorView.dispatch({ selection: { anchor: this.editorView.state.selection.ranges[0].from + insertedText.length, head: this.editorView.state.selection.ranges[0].from + insertedText.length } })
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

        const selectedText = this.editorView.state.sliceDoc(
            this.editorView.state.selection.ranges[0].from,
            this.editorView.state.selection.ranges[0].to)

        // do nothing if no text is selected
        if (selectedText.length == 0)
            return

        try {
            let replacement: string = filterFn(selectedText)
            this.editorView.dispatch(this.editorView.state.replaceSelection(replacement))
        } catch (error: any) {
            alert(error.message)
        }
    }

    getText(): string {
        return this.editorView.state.doc.toString()
    }

    setText(text: string) {
        this.editorView.dispatch(this.editorView.state.update({ selection: { anchor: 0, head: this.editorView.state.doc.length }, userEvent: "select" }))
        this.editorView.dispatch(this.editorView.state.replaceSelection(text))
    }

}

