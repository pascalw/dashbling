import { EventHistory } from "./EventHistory";
import { Event } from "./Event";

export interface Subscriber {
  (event: Event): void;
}

export class EventBus {
  private subscribers: Subscriber[];
  private history: EventHistory;

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

  async publish(id: string, data: any) {
    const event: Event = { id, data, updatedAt: new Date(Date.now()) };
    this.subscribers.forEach(subscriber => subscriber(event));
    return this.history.put(id, event);
  }

  async replayHistory(subscriber: Subscriber) {
    const events = await this.history.getAll();
    events.forEach(event => subscriber(event));
  }
}
