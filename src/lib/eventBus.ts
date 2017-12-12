export interface Event {
  id: string;
  data: any;
  updatedAt: Date;
}

export interface Subscriber {
  (event: Event): void;
}

export class EventBus {
  subscribers: Subscriber[] = [];
  history: { [key: string]: Event } = {};

  subscribe(subscriber: Subscriber) {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: Subscriber) {
    const idx = this.subscribers.indexOf(subscriber);
    this.subscribers.splice(idx, 1);
  }

  publish(id: string, data: any) {
    const event: Event = { id, data, updatedAt: new Date(Date.now()) };
    this.subscribers.forEach(subscriber => subscriber(event));

    this.history[id] = event;
  }

  replayHistory(subscriber: Subscriber) {
    Object.values(this.history).forEach(event => subscriber(event));
  }
}
