import { DicItem, ObjStrStr } from "./index";

class Item {
    private data: DicItem;
    private id: number;
    private parentDOM: HTMLElement;
    private DOM: HTMLElement | null;
    private titleDOM: HTMLElement | null;

    constructor(data: DicItem, parentDOM: HTMLElement, id: number) {
        this.data = data;
        this.id = id;
        this.parentDOM = parentDOM;
        this.DOM = null;
        this.titleDOM = null;

        this.render();
    }

    group(title: string, content: string): string {
        if (title === '' || content === '') {
            return '';
        }
        return `<div class="group">
                    <p class="sub-title">${title}</p>
                    <p class="sub-content">${content}</p>
                </div>`;
    }

    synonyms(): string {
        let HTML = '';
        if (this.data.syn && this.data.syn.length > 0) {
            HTML = this.group('Sinonimai', this.data.syn.join(', '));
        }
        return HTML;
    }

    more(): string {
        let HTML = '';
        if (this.data.more && this.data.more.length > 0) {
            for (const link of this.data.more) {
                if (typeof link !== 'string' || link === '') {
                    continue;
                }

                const url = new URL(link);
                const domain = url.hostname.split('www.').at(-1);
                HTML += `<a href="${url.href}" target="_blank">${domain}</a>`;
            }
            if (HTML === '') {
                return HTML;
            }
            HTML = this.group('Tolimesniam skaitymui', HTML);
        }
        return HTML;
    }

    show(): void {
        if (this.DOM) {
            this.DOM.style.display = 'flex';
        }
    }

    hide(): void {
        if (this.DOM) {
            this.DOM.style.display = 'none';
        }
    }

    expand(): void {
        if (this.DOM) {
            this.DOM.classList.add('expand');
        }
    }

    collapse(): void {
        if (this.DOM) {
            this.DOM.classList.remove('expand');
        }
    }

    toggle(): void {
        if (this.DOM) {
            this.DOM.classList.toggle('expand');
        }
    }

    render(): void {
        const id = `item-${this.id}`;
        const bookmarkHTML = `<div class="actions">
                                <span>Bookmark</span>
                            </div>`;
        const HTML = `<article id="${id}" class="">
                        <div class="top">
                            <div class="title">
                                <span class="expand">+</span>
                                <span class="collapse">-</span>
                                <p class="">${this.data.name}</p>
                            </div>
                            ${false ? bookmarkHTML : ''}
                        </div>
                        <div class="details">
                            ${this.synonyms()}
                            ${this.group('Aprašymas', this.data.desc)}
                            ${this.more()}
                        </div>
                    </article>`;
        if (!this.parentDOM) {
            return;
        }
        this.parentDOM.insertAdjacentHTML('beforeend', HTML);
        this.DOM = this.parentDOM.querySelector('#' + id)!;
        this.titleDOM = this.DOM.querySelector('.title')!;
        this.titleDOM.addEventListener('click', this.toggle.bind(this));
    }

    convertText(text: string): string {
        const ltu: ObjStrStr = {
            'ą': 'a',
            'č': 'c',
            'ę': 'e',
            'ė': 'e',
            'į': 'i',
            'š': 's',
            'ų': 'u',
            'ū': 'u',
            'ž': 'z',
        }
        text = text.toLowerCase();
        let newText = '';
        for (const symbol of text) {
            newText += ltu[symbol] ? ltu[symbol] : symbol;
        }
        return newText;
    }

    searchTitle(title: string, text: string): boolean {
        return this.convertText(title).includes(text);
    }

    searchDescription(title: string, text: string): boolean {
        return this.convertText(title).includes(text);
    }

    searchSynonyms(list: string[], text: string): boolean {
        let found = false;
        if (list && list.length > 0) {
            for (const item of list) {
                if (this.convertText(item).includes(text)) {
                    found = true;
                    break;
                }
            }
        }
        return found;
    }

    searchMoreLinks(list: string[], text: string): boolean {
        let found = false;
        if (list && list.length > 0) {
            for (const item of list) {
                if (item.toLowerCase().includes(text)) {
                    found = true;
                    break;
                }
            }
        }
        return found;
    }

    search(text: string): boolean {
        if (text === '') {
            this.show();
            return true;
        }

        text = this.convertText(text);
        const inTitle = this.searchTitle(this.data.name, text);
        const inDesc = this.searchDescription(this.data.desc, text);
        const inSynonyms = this.searchSynonyms(this.data.syn, text);
        const inMoreLinks = this.searchMoreLinks(this.data.more, text);

        if (inTitle || inDesc || inSynonyms || inMoreLinks) {
            this.show();
            return true;
        } else {
            this.hide();
            return false;
        }
    }
}

export { Item }