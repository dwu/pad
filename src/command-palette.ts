import "ninja-keys"

import { FilterAction } from "./filter-action.ts"
import { Editor } from "./editor.ts"

export class CommandPalette {

    ninja: any
    editor: Editor

    constructor(actions: FilterAction[], editor: Editor) {
        this.editor = editor
        this.ninja = document.querySelector("ninja-keys")!
        this.ninja.data = actions.map((e) => (
            {
                id: e.elementId,
                title: e.actionTitle,
                section: e.sectionTitle,
                handler: () => {
                    this.editor.applyFilter(e.filterFn)
                }
            }
        ))
    }

    show(focusAfterClose: any, checkInterval: number) {
        if (this.ninja.visible)
            return

        let interval = setInterval(() => {
            if (!this.ninja.visible) {
                focusAfterClose.focus()
                clearInterval(interval)
            }
        }, checkInterval)

        this.ninja.open()
    }

}

