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
const versionDOM = document.querySelector('.version-title');
const updatingText = `Version ${localDataVersion}: updating`;
let updateTick = 0;
let updateDots = '';
const updatingClock = setInterval(() => {
    if (updateTick++ < 3) {
        updateDots += '.';
    }
    else {
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
function terminateClock(msg, err = true) {
    clearInterval(updatingClock);
    if (versionDOM) {
        versionDOM.textContent = `Versija ${originDataVersion} ${msg}.`;
    }
}
// GET CURRENT VERSION
await fetch(repoURL + packageFile)
    .then(data => data.json())
    .then(data => {
    originDataVersion = data.version;
})
    .catch((e) => {
    console.log(e);
    terminateClock('negalėjo būti atnaujinta', true);
});
// UPDATE DATA AND VERSION
if (localDataVersion !== originDataVersion) {
    await fetch(repoURL + dataFile)
        .then(data => data.json())
        .then(data => {
        localStorage.setItem(localVersionKey, originDataVersion);
        localStorage.setItem(localDataKey, JSON.stringify(data));
        terminateClock('atnaujinta sėkmingai');
    })
        .catch((e) => {
        console.log(e);
        terminateClock('negalėjo būti atnaujinta', true);
    });
}
else {
    terminateClock('yra naujausia');
}
// APP INIT
const localDataJSON = localStorage.getItem(localDataKey);
if (localDataJSON) {
    try {
        const localData = JSON.parse(localDataJSON);
        dictionaryInit(localData);
    }
    catch (error) {
        console.log(error);
    }
}
