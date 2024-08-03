/*
    Based on: https://gist.github.com/adactio/be3fb1e7c15a47a90f87c7df11158e2e
*/

export class Storage {
    key: string

    constructor() {
        this.key = window.location.href;
    }

    public get(): (string | null) {
        let item = window.localStorage.getItem(this.key);
        if (item) {
            var data = JSON.parse(item);
            return data.content;
        }

        return null;
    }

    public set(content: (string | null)) {
        if (content) {
            let item = JSON.stringify({ 'content': content });
            window.localStorage.setItem(this.key, item);
        } else {
            window.localStorage.removeItem(this.key);
        }
    }
}