import { Storage, CrateType } from "./storage";
import template from "./levelnav.html";

export function levelnav() {
  document.getElementsByClassName("levelnav")[0].innerHTML = template.replace('{testvar}', "levels go here");
}
