import { Storage, CrateType, StorageCrate } from "./storage";
import template from "./mapnav.html";
import { StateProvider } from "./statemanager";
import { MapInfo } from "./data/data";
import hydrate from './ui/addcontent';

function mapclick(i: number) {
  function mapclick_(e: any) {
    e.stopPropagation();
    StateProvider.maphash = parseInt(
      document.getElementsByClassName("mapcard")[i].getAttribute("data-map")
    );
  }
  return mapclick_;
}

export function mapnav() {
  Storage.withDb().then((s) =>
    s.getAllMaps((maps: Array<MapInfo>) => {

      const el: Element = document.createElement('div');
      const mapnames = ["busan", "lijiang", "blizz"];

      maps
        .filter((info, i) => i < 3)
        .map((info, i) =>
          template
            .replace("{map}", mapnames[i % mapnames.length])
            .replace("{mapkey}", "" + info.hash.value)
        )
        .forEach((rawHtml, i) => {
          el.innerHTML += rawHtml;
        });


      Array.from(el.children).map((el: Element, i: number) => el.addEventListener("click", mapclick(i)));
      el.setAttribute("style", "width: " + 350 * maps.length + "px");

      hydrate("maphistoryinner", el);
    })
  );

  // let links = logs.map(log => template.replace('{mapkey}', ""+log.hash)).forEach(rawHtml => {
  //     console.log(rawHtml);
  //     document.getElementsByClassName('maphistorysmall')[0].innerHTML += rawHtml;
  // });
}
