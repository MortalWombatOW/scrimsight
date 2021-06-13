import { StateProvider } from "./statemanager";
import { Storage, CrateType } from "./storage";
import { TaskType } from "./task";
import { setContentHtml } from "./util";

import {WorkerManager} from './workermanager';


const template = `
<div class="uploadmodal" onclick= "event.stopPropagation();">
    <input type="file" accept=".txt" class="fileinput" />
</div>
`;


export function setupFileUpload() {
  document
    .getElementsByClassName("uploadbutton")[0]
    .addEventListener("click", insertUploadModal, false);
}

function insertUploadModal() {
  setContentHtml(template);
  document
    .getElementsByClassName("fileinput")[0]
    .addEventListener("change", readFile);
}

function removeUploadModal() {
  setContentHtml("");
}

function readFile(evt: any) {
  var files = evt.target.files;
  var file = files[0];
  console.log(file);
  var reader = new FileReader();
  reader.onload = function (event) {
    console.log(event.target.result);
    const hash: number = Storage.singleton().newMap(event.target.result as string, file);
    StateProvider.maphash = hash;
    WorkerManager.runTask(TaskType.ParseLog);
  };
  reader.readAsText(file);
}
