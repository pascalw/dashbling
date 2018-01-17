import { EventHistory } from "./EventHistory";
import { Event } from "./Event";

export interface Subscriber {
  (event: Event): void;
}

export class EventBus {
  subscribers: Subscriber[];
  history: EventHistory;

  constructor(history: EventHistory) {
    this.subscribers = [];
    this.history = history;
  }

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

    this.history.put(event.id, event);
  }

  replayHistory(subscriber: Subscriber) {
    this.history.get().forEach(event => subscriber(event));
  }
}
