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
        // console.log(this.readers.entities.filter(entity=>entity.components.get(ReadStorageComponent).value == undefined).length);
        
        if (this.writers.entities.length + this.readers.entities.filter(entity=>entity.components.get(ReadStorageComponent).value == undefined).length == 0) {
            return;
        }

        
        // debugger;


        for (const entity of this.writers.entities) {
            const write = entity.components.get(WriteStorageComponent);
            entity.components.remove(write);
            let tx = this.db.transaction('map', 'readwrite')
            let store = tx.objectStore('map');
            await store.put(write.value, write.key);
            await tx.done
            console.log("writing ", write);
            
        }

        for (const read of this.readers.entities.map(entity => entity.components.get(ReadStorageComponent)).filter(read => read.value === undefined)) {
            let tx = this.db.transaction('map', 'readwrite')
            let store = tx.objectStore('map');
            console.log(read.key);
            read.value = await store.get(read.key);
            await tx.done
        }
    }
}