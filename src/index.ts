import { Storage, CrateType } from "./storage";
import { setupFileUpload } from "./upload";
import { levelnav } from "./levelnav";
import "./main.scss";
import { mapnav } from "./mapnav";
import log from "./logger";
import { mapview } from "./mapview";
import { StateProvider } from "./statemanager";

// main
// make sure DB is loaded before populating ui
Storage.singleton()
  .getLoadPromise()
  .then(() => {
    log("building UI");
    mapnav();
    setupFileUpload();
    levelnav();
    mapview(undefined);
    StateProvider.addMapChangeCallback(mapview);
  });
