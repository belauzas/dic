import { Dictionary, HTML, JSONstring } from "./index";
import { dictionaryInit } from './list.js';

const packageFilePath = '../package.json';
const dataFilePath = '../data/dic.json';

let localDataVersion = '0.0.0';
let originDataVersion = '0.0.0';

const localVersionKey = 'dic-version';
const localDataKey = 'dic-content';
const localVersion = localStorage.getItem(localVersionKey);

if (localVersion) {
    localDataVersion = localVersion;
}

const versionDOM: HTML = document.querySelector('.version-title');
const updatingText = `Version ${localDataVersion}: updating`;
let updateTick = 0;
let updateDots = '';
const updatingClock = setInterval(() => {
    if (updateTick++ < 3) {
        updateDots += '.';
    } else {
        updateDots = '';
        updateTick = 0;
    }
    if (versionDOM) {
        versionDOM.textContent = updatingText + updateDots;
    }
}, 200);

/**
 * 
 * @param {'string'} msg 
 * @param {boolean} err 
 */
function terminateClock(msg: string, err = true) {
    clearInterval(updatingClock);
    if (versionDOM) {
        versionDOM.textContent = `Versija ${originDataVersion} ${msg}.`;
    }
}

// GET CURRENT VERSION
await fetch(packageFilePath)
    .then(data => data.json())
    .then(data => {
        originDataVersion = data.version;
    })
    .catch((e) => {
        console.log(e);
        terminateClock('negalėjo būti atnaujinta', true);
    })

// UPDATE DATA AND VERSION
if (localDataVersion !== originDataVersion) {
    await fetch(dataFilePath)
        .then(data => data.json())
        .then(data => {
            localStorage.setItem(localVersionKey, originDataVersion);
            localStorage.setItem(localDataKey, JSON.stringify(data));
            terminateClock('atnaujinta sėkmingai');
        })
        .catch((e) => {
            console.log(e);
            terminateClock('negalėjo būti atnaujinta', true);
        })
} else {
    terminateClock('yra naujausia');
}

// APP INIT
const localDataJSON: JSONstring = localStorage.getItem(localDataKey);
if (localDataJSON) {
    try {
        const localData: Dictionary = JSON.parse(localDataJSON);
        dictionaryInit(localData);
    } catch (error) {
        console.log(error);
    }
}
