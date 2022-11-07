import { Item } from "./Item.js";

function dictionaryInit(dic) {
    /** @type {HTMLElement} */
    const dictionaryDOM = document.getElementById('dictionary');
    /** @type {[Item]} */
    const dictionary = [];

    let id = 0;
    for (const d of dic) {
        const item = new Item(d, dictionaryDOM, ++id);
        dictionary.push(item);
    }
    dictionary[0].expand();

    /** @type {HTMLElement} */
    const inputDOM = document.getElementById('search');
    inputDOM.focus();

    function updateList() {
        const text = inputDOM.value;
        let first = false;
        for (const item of dictionary) {
            const res = item.search(text);
            if (!first && res) {
                item.expand();
                first = true;
            } else {
                item.collapse();
            }
        }
        if (!first) {
            dictionary[0].expand();
        }
    }

    inputDOM.addEventListener('keyup', updateList);
    inputDOM.addEventListener('search', updateList);
}

export { dictionaryInit }