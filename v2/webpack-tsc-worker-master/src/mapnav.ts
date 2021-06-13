import { Storage, CrateType, StorageCrate } from "./storage";
import template from "./mapnav.html";
import { StateProvider } from "./statemanager";
import { MapInfo } from "./data/data";

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
    s.getAllMaps((request) => {
      const maps: Array<MapInfo> = request.target.result;

      const inner: Element =
        document.getElementsByClassName("maphistoryinner")[0];
      const mapnames = ["busan", "lijiang", "blizz"];

      maps
        .filter((info, i) => i < 3)
        .map((info, i) =>
          template
            .replace("{map}", mapnames[i % mapnames.length])
            .replace("{mapkey}", "" + info.hash.value)
        )
        .forEach((rawHtml, i) => {
          inner.innerHTML += rawHtml;
        });


      Array.from(inner.children).map((el: Element, i: number) => el.addEventListener("click", mapclick(i)));
      inner.setAttribute("style", "width: " + 350 * maps.length + "px");
    })
  );

  // let links = logs.map(log => template.replace('{mapkey}', ""+log.hash)).forEach(rawHtml => {
  //     console.log(rawHtml);
  //     document.getElementsByClassName('maphistorysmall')[0].innerHTML += rawHtml;
  // });
}
