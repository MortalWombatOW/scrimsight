import { AbstractEntitySystem, Aspect, Engine, System } from "@trixt0r/ecs";
import { ClickableComponent } from "../components/clickable";
import { LogComponent } from "../components/log";
import { MetadataComponent } from "../components/metadata";
import { ReadStorageComponent, WriteStorageComponent } from "../components/storage";
import { UIComponent } from "../components/ui";
import { ScrimsightEntity } from "../entity";
import { openDB, deleteDB, wrap, unwrap, IDBPDatabase } from 'idb';

export class StorageSystem extends System {

    private readers: Aspect;
    private writers: Aspect;
    private db: IDBPDatabase;
    constructor() {
        super(0)
    }

    onAddedToEngine(engine: Engine): void {
        this.readers = Aspect.for(engine).all(ReadStorageComponent);
        this.writers = Aspect.for(engine).all(WriteStorageComponent);
        console.log('added');
      }
    

    async process() {
        if (this.db == undefined) {
            this.db = await openDB('scrimsight', 10, {
                upgrade(db, oldVersion, newVersion, transaction) {
                  if (!db.objectStoreNames.contains("map")) {
                    const mapOS = db.createObjectStore("map");
                    mapOS.createIndex("timestamp", "timestamp", { unique: false });
                    console.log('upgrade');
                  }
                },
                blocked() {
                  console.error('IDB blocked');
                },
                blocking() {
                    console.error('IDB blocking');
                },
                terminated() {
                    console.error('IDB terminated');
                }
              });
        }


        if (this.writers.entities.length + this.readers.entities.length == 0) {
            return;
        }

        let tx = this.db.transaction('map', 'readwrite')
        let store = tx.objectStore('map')
        console.log('loaded db');



        for (const entity of this.writers.entities) {
            const write = entity.components.get(WriteStorageComponent);
            entity.components.remove(write);
            await store.put(write.value, write.key);
            console.log("writing ", write);
            
        }

        for (const entity of this.readers.entities) {
            const read = entity.components.get(ReadStorageComponent);
            entity.components.remove(read);
            read.value = store.get(read.key);
            console.log("reading ", read);
            
        }
    }
}