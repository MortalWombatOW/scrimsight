type Callback = (data: any) => void;

class PubSub {
  private subscribers: {[eventType: string]: Callback[]} = {};

  // Subscribe to an event
  subscribe(eventType: string, callback: Callback): void {
    if (!this.subscribers[eventType]) {
      this.subscribers[eventType] = [];
    }
    this.subscribers[eventType].push(callback);
  }

  // Unsubscribe from an event
  unsubscribe(eventType: string, callback: Callback): void {
    if (!this.subscribers[eventType]) return;
    this.subscribers[eventType] = this.subscribers[eventType].filter(
      (cb) => cb !== callback,
    );
  }

  // Publish an event to all subscribers
  publish(eventType: string, data: any): void {
    if (!this.subscribers[eventType]) return;
    this.subscribers[eventType].forEach((callback) => callback(data));
  }
}

export default PubSub;
