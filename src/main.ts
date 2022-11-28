import { Dictionary, JSONstring } from "./index";
import { dictionaryInit } from './list.js';
import { localData } from "./localData.js";
import { fetchVersion, fetchContent } from "./fetchData.js";

enum local {
    lastUpdate = 'dic-last-update',
    version = 'dic-version',
    content = 'dic-content',
}

enum message {
    failed = 'negalėjo būti atnaujinta',
    success = 'atnaujinta sėkmingai',
    upToDate = 'yra naujausia',
}

const versionDOM = document.querySelector('.version-title')!;
let updateClock: number = 0;
let currentVersion = '0.0.0';
let currentContent: Dictionary = [];
let nextVersion = '0.0.0';
let nextContent: Dictionary = [];
let lastRefreshTime = 0;

function updateStart(): void {
    let updateTick = 0;
    let updateDots = '';
    updateClock = setInterval(() => {
        if (updateTick++ < 3) {
            updateDots += '.';
        } else {
            updateDots = '';
            updateTick = 0;
        }
        const updatingText = `Versija ${currentVersion}: atnaujinama`;
        versionDOM.textContent = updatingText + updateDots;
    }, 200);
}

function updateCompleted(msg: string): void {
    clearInterval(updateClock);
    versionDOM.textContent = `Versija ${currentVersion} ${msg}.`;
}

async function updateAll(): Promise<boolean> {
    updateStart();

    // Randam turima versija
    const [localVersionErr, localVersionValue] = localData.getJSON(local.version);
    currentVersion = localVersionValue as string;

    // Randam turimus duomenis
    const [localContentErr, localContentValue] = localData.getJSON(local.content);
    currentContent = localContentValue as Dictionary;

    if (localVersionErr || localContentErr) {
        try {
            // atsisiunciame versija
            const [originVersionErr, originVersionValue] = await fetchVersion();
            if (originVersionErr) {
                updateCompleted(message.failed);
                return false;
            }
            currentVersion = originVersionValue;

            // atsisiunciame duomenis
            const [originContentErr, originContentValue] = await fetchContent();
            if (originContentErr) {
                updateCompleted(message.failed);
                return false;
            }

            // issaugom versija
            localData.setJSON(local.version, originVersionValue);

            // issaugom turini
            localData.setJSON(local.content, originContentValue);

            // sugeneruojame DOM
            dictionaryInit(originContentValue);
            updateCompleted(message.success);
        } catch (error) {
            updateCompleted(message.failed);
        }
    } else {
        // atsisiunciame versija
        const [originVersionErr, originVersionValue] = await fetchVersion();
        if (originVersionErr) {
            updateCompleted(message.failed);
            return false;
        }
        nextVersion = originVersionValue;

        if (nextVersion !== currentVersion) {
            // atnaujinime (sukeiciame) versija
            localData.setJSON(local.version, nextVersion);
            currentVersion = nextVersion;


            // atnaujinime duomenis
            const [originContentErr, originContentValue] = await fetchContent();
            if (originContentErr) {
                updateCompleted(message.failed);
                return false;
            }
            nextContent = originContentValue;

            // atnaujinime (sukeiciame) duomenis
            localData.setJSON(local.content, nextContent);
            currentContent = nextContent;
        }

        // sugeneruojame DOM
        dictionaryInit(currentContent);
        updateCompleted(message.upToDate);

        // tikriname update
        // if (yra atnaujinimas) {
        //     atsisiunciame versija
        //     atsisiunciame duomenis
        //     pasiulom atsinaujinti
        //     if (sutinka atsinaujinti) {
        //         perkraunam puslapi
        //     }
        // }
    }

    // const [localLastUpdateErr, localLastUpdateValue] = localData.getJSON(local.lastUpdate);
    // if (localLastUpdateErr) {
    // lastRefreshTime = +(new Date());
    // console.log(lastRefreshTime);
    // }

    return true;
}

updateAll();