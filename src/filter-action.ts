export class FilterAction {
    elementId: string = ""
    sectionTitle: string = ""
    actionTitle: string = ""
    filterFn: (text: string) => string = () => ""

    constructor(init?: Partial<FilterAction>) {
        Object.assign(this, init)
    }
}

export function htmlEncode(s: string): string {
    let textArea = document.createElement('textarea');
    textArea.innerText = s;
    return textArea.innerHTML;
}

export function htmlDecode(s: string): string {
    let textArea = document.createElement('textarea');
    textArea.innerHTML = s;
    return textArea.value;
}

export function epochConvert(timestampString: string): string {
    try {
        const milliseconds = parseInt(timestampString) * 1000;
        const date = new Date(milliseconds);

        const utc = date.toISOString()
        const local = new Date((date.getTime() + ((new Date()).getTimezoneOffset()/60 * -1)*60*60*1000))

        return `Epoch          : ${timestampString}\nUTC Timestamp  : ${utc}\nLocal Timestamp: ${local}`;
    } catch (err) {
        alert(err);
        return timestampString;
    }
}

export function removeLinebreaks(s: string): string {
    s = s.replace(new RegExp('\\r\\n', 'g'), '');
    s = s.replace(new RegExp('\\n', 'g'), '');
    return s;
}

export function trimLines(s: string): string {
    s = s.replace(new RegExp('\\s*\\r\\n\\s*', 'g'), '\r\n');
    s = s.replace(new RegExp('\\s*\\n\\s*', 'g'), '\n');
    return s;
}

export function removeBlanks(s: string): string {
    s = s.replace(new RegExp('\\s*', 'g'), '');
    return s;
}

export function compactBlanks(s: string): string {
    s = s.replace(new RegExp('\\s+', 'g'), ' ');
    return s;
}

export function removeBackslashes(s: string): string {
    s = s.replace(new RegExp('\\\\', 'g'), '');
    return s;
}

export function insertBlanksAfterNCharacters(s: string, n: number): string {
    s = s.replace(new RegExp('(.{' + n + '})', 'g'), '$1 ');
    return s;
}
