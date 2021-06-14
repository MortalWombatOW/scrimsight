import { Storage, CrateType } from "./storage";
import template from "./mapview.html";
import { StateProvider } from "./statemanager";
import { loadData, MapInfo } from "./data/data";

export function mapview(hash: number) {
    if (hash === undefined) {
        return;
    }

    Storage.withDb().then(db => db.getMap(hash, addData));

  
}


function addData(map: MapInfo) {
    document.getElementsByClassName("content")[0].innerHTML = template.replace('{keys}', JSON.stringify(Object.keys(map)));
    document.getElementsByClassName("processmapbutton")[0].addEventListener('click', () => loadData(map));
}