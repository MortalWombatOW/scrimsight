import { MapInfo } from "../data/data";
import hydrate from "./addcontent";

export function renderAllTimeSeries(info: MapInfo) {
    Array.from(document.getElementsByClassName('time-series')).map(el => renderTimeSeries(el, info));
}

export function renderTimeSeries(el: Element, info: MapInfo) {
    const events = info.events.values;
    const team1_damage = events.filter(event => event.eventType = 'dmg')
    // el.innerHTML = 
}