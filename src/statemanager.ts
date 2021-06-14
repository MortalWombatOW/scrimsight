import log from "./logger";

type MapChangeCallback = (hash: number) => void;

export class StateProvider {
    private static _maphash: number;
    private static _mapchangeCallbacks: Array<MapChangeCallback>;


    public static get maphash() {
        return this._maphash;
    }

    public static set maphash(hash: number) {
        log("Setting hash: " + hash);
        this._maphash = hash;
        this.mapchangeCallbacks.map(fn => fn(hash));
    }

    public static get mapchangeCallbacks() {
        if (this._mapchangeCallbacks === undefined) {
            this._mapchangeCallbacks = [];
        }

        return this._mapchangeCallbacks;
    }

    public static addMapChangeCallback(callback: MapChangeCallback) {
        this.mapchangeCallbacks.push(callback);
    }
}