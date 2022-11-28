import { Dictionary } from "./index.js";

function fetchVersion(): Promise<[boolean, string]> {
    return new Promise(function (resolve, reject) {
        fetch('../package.json')
            .then(data => data.json())
            .then(data => {
                resolve([false, data.version]);
            })
            .catch((e) => {
                reject([true, 'Nepavyko atnaujinti versijos']);
            })
    })
}

function fetchContent(): Promise<[boolean, Dictionary]> {
    return new Promise(function (resolve, reject) {
        fetch('../data/dic.json')
            .then(data => data.json())
            .then(data => {
                resolve([false, data]);
            })
            .catch((e) => {
                reject([true, 'Nepavyko atnaujinti turinio']);
            })
    })
}

export { fetchVersion, fetchContent }