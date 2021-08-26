import { Storage, CrateType } from "./storage";
import template from "./mapview.html";
import { StateProvider } from "./statemanager";
import {MapInfo} from "./data/data";
import hydrate from "./ui/addcontent";

export function mapview(hash: number) {
    if (hash === undefined) {
        return;
    }

    Storage.withDb().then(db => db.getMap(hash, addData));

  
}


function addData(map: MapInfo) {
    const el = document.createElement('div');
    el.innerHTML = template.replace('{keys}', JSON.stringify(Object.keys(map)));
    hydrate('content', el);
    // document.getElementsByClassName("processmapbutton")[0].addEventListener('click', () => loadData(map));
}