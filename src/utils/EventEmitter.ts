type EventCallback = (...args: any[]) => void;

export class EventEmitter {
  private events: Record<string, EventCallback[]> = {};

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event: string, ...args: any[]) {
    const callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach((callback) => callback(...args));
    }
  }
}
