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

    inputDOM.addEventListener('keyup', (e) => {
        e.preventDefault();
        const text = inputDOM.value;
        for (const item of dictionary) {
            item.search(text);
        }
    })
}

export { dictionaryInit }