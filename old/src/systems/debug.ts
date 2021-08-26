import { AbstractEntitySystem, Aspect, Engine, System } from "@trixt0r/ecs";
import { ClickableComponent } from "../components/clickable";
import { LogComponent } from "../components/log";
import { MetadataComponent } from "../components/metadata";
import {
  ReadStorageComponent,
  WriteStorageComponent,
} from "../components/storage";
import { UIComponent } from "../components/ui";
import { ScrimsightEntity } from "../entity";
import { openDB, deleteDB, wrap, unwrap, IDBPDatabase } from "idb";
import template from "../templates/debug.html";
import Tabulator from "tabulator-tables";

export class DebugSystem extends System {
  aspect: Aspect;
  dirty: boolean;
  constructor() {
    super(0);
  }

  onAddedToEngine(engine: Engine): void {
    const el = document.createElement("div");
    el.classList.add("debug");
    document.getElementsByTagName("body")[0].append(el);
    this.dirty = true;
    this.aspect = Aspect.for(engine).all();

    engine.addListener({
      onAddedEntities: (...entities) => {
        console.log("adding entities");
        this.dirty = true;
      },

      onAddedSystems: (...systems) => {
        console.log("adding systems");
        console.log(
          systems.map((s) =>
            (Object.getPrototypeOf(s).constructor.name as string).toLowerCase()
          )
        );
        this.dirty = true;
      },
    });

    this.process();
  }

  process() {
    if (!this.dirty) return;
    this.dirty = false;
    document.getElementsByClassName("debug")[0].innerHTML = template;

    console.log("yas");
    const components = Array.from(
      new Set(
        this.engine.entities
          .map((e) =>
            e.components.map(
              (a) => Object.getPrototypeOf(a).constructor.name as string
            )
          )
          .flat()
      )
    ).map((name) => name);

    // console.log(this.engine.entities.map(e => {
    //     return new Map(e.components.map(component => [(Object.getPrototypeOf(component).constructor.name as string).toLowerCase(), 'f']));
    // }));

    // console.log(this.aspect.entities.map(e => e.components.elements).flatMap((a, b) => a.concat(b)).map(name => { return name;}));

    // this.table.setData([{}]);
    document
      .getElementsByClassName("closebutton")[0]
      .addEventListener("click", (e) => {
        e.stopPropagation();
        console.log("yes");
        document.getElementsByClassName("debug")[0].classList.toggle("closed");
      });

    const table = new Tabulator(".entities", {
      columns: Array.from(
        new Set(
          this.engine.entities
            .map((e) =>
              e.components.map(
                (a) => Object.getPrototypeOf(a).constructor.name as string
              )
            )
            .flat()
        )
      ).map((name) => {
        return { title: name, field: name.toLowerCase() };
      }),
      data: this.engine.entities.map((e) => {
        return Object.fromEntries(
          e.components.map((component) => [
            (
              Object.getPrototypeOf(component).constructor.name as string
            ).toLowerCase(),

            Object.entries(
              e.components.get(Object.getPrototypeOf(component).constructor)
            )
              .map((k, v) => k + ": " + JSON.stringify(v).substr(0, 5))
              .join(", "),
          ])
        );
      }),
    });

    // console.log(table);
  }

  updateEntities() {}
}
