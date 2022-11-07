/**
* @typedef Data
* @type {object}
* @property {string} data.name Pavadinimas
* @property {string} data.desc Aprasymas
* @property {[string]} data.syn Sinonimai
* @property {[string]} data.more Nuorodos
*/

class Item {
    /**
     * @param {Data} data Objekto duomenys
     * @param {HTMLElement} parentDOM Tevinis elementas, kuriame bus kuriamas turinys
     * @param {number} id Elemento ID
     */
    constructor(data, parentDOM, id) {
        /** @private {Data} */
        this.data = data;
        /** @private {number} */
        this.id = id;
        /** @private {HTMLElement} */
        this.parentDOM = parentDOM;
        /** @private {HTMLElement|null} */
        this.DOM = null;
        /** @private {HTMLElement|null} */
        this.titleDOM = null;

        this.render();
    }

    group(title, content) {
        return `<div class="group">
                    <p class="sub-title">${title}</p>
                    <p class="sub-content">${content}</p>
                </div>`;
    }

    /**
     * @returns {string} HTML
     */
    synonyms() {
        let HTML = '';
        if (this.data.syn && this.data.syn.length > 0) {
            HTML = this.group('Sinonimai', this.data.syn.join(', '));
        }
        return HTML;
    }

    /**
     * @returns {string} HTML
     */
    more() {
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

    show() {
        if (this.DOM) {
            this.DOM.style.display = 'flex';
        }
    }

    hide() {
        if (this.DOM) {
            this.DOM.style.display = 'none';
        }
    }

    expand() {
        this.DOM.classList.add('expand');
    }

    collapse() {
        this.DOM.classList.remove('expand');
    }

    toggle() {
        this.DOM.classList.toggle('expand');
    }

    render() {
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
        this.parentDOM.insertAdjacentHTML('beforeend', HTML);

        this.DOM = this.parentDOM.querySelector('#' + id);
        const titleDOM = this.DOM.querySelector('.title');

        titleDOM.addEventListener('click', this.toggle.bind(this));
    }

    /**
     * @param {string} text 
     * @returns {boolean} Matches search query
     */
    search(text) {
        if (text === '') {
            return this.show();
        }

        text = text.toLowerCase();
        const inTitle = this.data.name.toLowerCase().includes(text);
        const inDesc = this.data.desc.toLowerCase().includes(text);
        let inSynonyms = false;
        if (this.data.syn && this.data.syn.length > 0) {
            for (const item of this.data.syn) {
                if (item.toLowerCase().includes(text)) {
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