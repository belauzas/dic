import { DicItem, HTML, ObjStrStr } from "./index";

class Item {
    private data: DicItem;
    private id: number;
    private parentDOM: HTML;
    private DOM: HTML;
    private titleDOM: HTML;

    constructor(data: DicItem, parentDOM: HTML, id: number) {
        this.data = data;
        this.id = id;
        this.parentDOM = parentDOM;
        this.DOM = null;
        this.titleDOM = null;

        this.render();
    }

    group(title: string, content: string): string {
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
                const url = new URL(link);
                const domain = url.hostname.split('www.').at(-1);
                HTML += `<a href="${url.href}" target="_blank">${domain}</a>`;
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
        const HTML = `<article id="${id}" class="">
                        <div class="top">
                            <div class="title">
                                <span class="expand">+</span>
                                <span class="collapse">-</span>
                                <p class="">${this.data.name}</p>
                            </div>
                            <div class="actions">
                                <span>Bookmark</span>
                            </div>
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

    search(text: string): boolean {
        if (text === '') {
            this.show();
            return true;
        }

        text = this.convertText(text);
        const { name, desc, syn } = this.data;
        const inTitle = this.convertText(name).includes(text);
        const inDesc = this.convertText(desc).includes(text);
        let inSynonyms = false;
        if (syn && syn.length > 0) {
            for (const item of syn) {
                if (this.convertText(item).includes(text)) {
                    inSynonyms = true;
                    break;
                }
            }
        }
        let inMoreLinks = false;
        if (this.data.more && this.data.more.length > 0) {
            for (const item of this.data.more) {
                if (item.toLowerCase().includes(text)) {
                    inMoreLinks = true;
                    break;
                }
            }
        }

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