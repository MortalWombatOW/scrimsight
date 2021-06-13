import log from "./logger";

export class StateProvider {
    private static _maphash: number;

    public static get maphash() {
        return this._maphash;
    }

    public static set maphash(hash: number) {
        log("Setting hash: " + hash);
        this._maphash = hash;
    }
}