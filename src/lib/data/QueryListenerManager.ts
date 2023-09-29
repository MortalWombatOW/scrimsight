// QueryListenerManager.ts

type ListenerCallback = () => void;

export class QueryListenerManager {
  private listeners: {[key: string]: ListenerCallback[]} = {};
  private globalListeners: ListenerCallback[] = [];

  registerListener(queryName: string, callback: ListenerCallback) {
    if (!this.listeners[queryName]) {
      this.listeners[queryName] = [];
    }
    this.listeners[queryName].push(callback);
  }

  registerGlobalListener(callback: ListenerCallback) {
    this.globalListeners.push(callback);
  }

  notifyListeners(queryName: string) {
    if (this.listeners[queryName]) {
      this.listeners[queryName].forEach((callback) => callback());
    }

    // Notify global listeners as well
    this.globalListeners.forEach((callback) => callback());
  }
}
