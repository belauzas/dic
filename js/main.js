import dic from '../data/dic.js';
import { dictionaryInit } from './list.js';

const repoURL = 'https://raw.githubusercontent.com/belauzas/dic/master/package.json';

fetch(repoURL)
    .then()
    .catch((e) => {
        console.log(e);
    })


dictionaryInit(dic);