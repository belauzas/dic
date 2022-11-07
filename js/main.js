import { dictionaryInit } from './list.js';

const repoURL = 'https://raw.githubusercontent.com/belauzas/dic/master/';
const packageFile = 'package.json';
const dataFile = 'data/dic.json';

let localDataVersion = '0.0.0';
let originDataVersion = '0.0.0';

const localVersionKey = 'dic-version';
const localDataKey = 'dic-content';
const localVersion = localStorage.getItem(localVersionKey);

if (localVersion) {
    localDataVersion = localVersion;
}

// GET CURRENT VERSION
await fetch(repoURL + packageFile)
    .then(data => data.json())
    .then(data => {
        originDataVersion = data.version;
    })
    .catch((e) => {
        console.log(e);
    })

// UPDATE DATA AND VERSION
if (localDataVersion !== originDataVersion) {
    await fetch(repoURL + dataFile)
        .then(data => data.json())
        .then(data => {
            localStorage.setItem(localVersionKey, originDataVersion);
            localStorage.setItem(localDataKey, JSON.stringify(data));
        })
        .catch((e) => {
            console.log(e);
        })
}

// APP INIT
const localDataJSON = localStorage.getItem(localDataKey);
try {
    const localData = JSON.parse(localDataJSON);
    dictionaryInit(localData);
} catch (error) {
    console.log(error);
}
