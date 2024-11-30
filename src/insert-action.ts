export class InsertAction {
    elementId: string = ""
    sectionTitle: string = ""
    actionTitle: string = ""
    insertFn: () => string = () => ""

    constructor(init?: Partial<InsertAction>) {
        Object.assign(this, init)
    }
}