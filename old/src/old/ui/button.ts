import { TaskType } from "../task";
import { WorkerManager } from "../workermanager"



export default function activateButtons() {
    Array.from(document.getElementsByTagName("button")).map(el => {
        if(el.getAttribute('data-path')) {
            // typescript magics
            
            el.addEventListener('click', () => WorkerManager.loadNode(el.getAttribute('data-path')));
            el.removeAttribute('data-task');
        }
    })
}