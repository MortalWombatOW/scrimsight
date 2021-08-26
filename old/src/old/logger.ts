export default function log(blob: any, isErr: boolean = false) {
    const isWorker = typeof window === "undefined";
    const prefix = isWorker ? "[worker] " : "[main] ";
    const logFn = isErr ? console.error : console.log;
    logFn(prefix + JSON.stringify(blob));
}