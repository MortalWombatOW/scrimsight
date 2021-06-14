import { MapInfo } from "./data/data";
import { cyrb53 } from "./util";

const isWorker = typeof window === "undefined";

const indexedDB = isWorker ? self.indexedDB : window.indexedDB;

const logprefix = isWorker ? "[worker] " : "[main] ";




export enum CrateType {
  Log,
}

interface StorageIndex {
  crateIds: Array<string>;
}

export interface StorageCrate {
  type: CrateType;
  hash: number;
  content: any;
  timestamp: number;
  writer: string;
}

function log(blob: any) {
  console.log(logprefix + blob);
}

export class Storage {
  private static instance: Storage;

  private db: IDBDatabase;
  private loadPromise: Promise<Storage>;

  public static singleton(): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }
    return Storage.instance;
  }

  private constructor() {
    if (!indexedDB) {
      window.alert(
        "Your browser doesn't support a stable version of IndexedDB."
      );
      // todo allow stateless use
    }

    this.loadPromise = new Promise((resolve, reject) => {
      let request = indexedDB.open("scrimsight", 1);
      request.onupgradeneeded = (e: any) => this._addTables(e);
      request.onsuccess = (e: any) => {
        this.db = e.target.result;
        log("db set");
        resolve(this);
      };
    });

    // const indexBlob: string|null = localStorage.getItem(SCRIMSIGHT_STORAGE_INDEX_KEY);
    // if (indexBlob === null) {
    //   const newIndex: StorageIndex = {
    //     crateIds: []
    //   };
    //   localStorage.setItem(SCRIMSIGHT_STORAGE_INDEX_KEY, JSON.stringify(newIndex));
    // }
  }

  static withDb() {
    return Storage.singleton().getLoadPromise();
  }

  getLoadPromise(): Promise<Storage> {
    return this.loadPromise;
  }

  // add(type: CrateType, content:any, writer: string, overwrite: boolean = false) {
  //     // const isNew = this._addKeyToIndex(key);
  //     // if (isNew || overwrite) {
  //       this._set(crate);
  //     // }
  // }

  _addTables(e: any) {
    this.db = e.target.result;
    log("UPGRADE");
    if (!this.db.objectStoreNames.contains("map")) {
      const mapOS = this.db.createObjectStore("map");
      mapOS.createIndex("timestamp", "timestamp", { unique: false });
    }
  }

  // getCratesOfType(type: CrateType): Array<StorageCrate> {
  //     return this._index().crateIds.map((key: string) => this._get(key)).filter((crate: StorageCrate) => crate.type == type);
  // }

  private _pack(type: CrateType, content: any, writer: string): StorageCrate {
    return {
      timestamp: Date.now(),
      type,
      content,
      writer,
      hash: cyrb53(JSON.stringify(content)),
    };
  }

  private _key(crate: StorageCrate) {
    return crate.type + "-" + crate.hash;
  }

  private _set(info: MapInfo) {
    const req = this.db
      .transaction(["map"], "readwrite")
      .objectStore("map")
      .put(info, info.hash.value);

    req.onerror = log; 
    req.onsuccess = log;
  }

  private _get(e: any, hash?: number): IDBRequest<any[]> {
    const store = this.db
      .transaction(["map"], "readwrite")
      .objectStore("map");

    let req;

    if (!hash) {
      req = store.getAll();
    } else {
      req = store.get(hash);
    }

    req.onerror = console.error;
    req.onsuccess = (res:any) => e(res.target.result);

    return req;
  }

  getAllMaps(e: (request: any) => void) {
    return this._get(e);
  }

  getMap(hash: number, callback: Function) {
    return this._get(callback, hash);
  }


  newMap(log: string, file: File): number {
    // console.log(file);

    const info: MapInfo = {
      log: {value: log},
      timestamp: {value: file.lastModified},
      hash: {value: cyrb53(log)},
    };
    // console.log(info);
    this._set(info);
    return info.hash.value;
  }

  inspect() {
    return this._get((request: IDBRequest) => console.log(request));
  }
}
