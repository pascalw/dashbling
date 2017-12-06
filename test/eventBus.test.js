const eventBus = require("../lib/eventBus");
const { mockDate } = require("./utils");

const NOW = Date.now();

beforeEach(() => {
  mockDate(NOW);
});

afterEach(() => {
  Date.now.restore();
});

test("sends events to all subscribers", () => {
  const subscriber1 = jest.fn();
  const subscriber2 = jest.fn();

  eventBus.subscribe(subscriber1);
  eventBus.subscribe(subscriber2);

  eventBus.publish("myEvent", { arg: "1" });

  expect(subscriber1).toBeCalledWith({
    id: "myEvent",
    data: { arg: "1" },
    updatedAt: NOW
  });
  expect(subscriber2).toBeCalledWith({
    id: "myEvent",
    data: { arg: "1" },
    updatedAt: NOW
  });
});

test("replays previously received events", () => {
  const subscriber = jest.fn();

  eventBus.publish("myEvent", { arg: "1" });
  eventBus.publish("myEvent", { arg: "2" }); // last per id is replayed
  eventBus.publish("myOtherEvent", { arg: "3" });

  eventBus.subscribe(subscriber);
  eventBus.replayHistory(subscriber);

  expect(subscriber).toBeCalledWith({
    id: "myEvent",
    data: { arg: "2" },
    updatedAt: NOW
  });
  expect(subscriber).toBeCalledWith({
    id: "myOtherEvent",
    data: { arg: "3" },
    updatedAt: NOW
  });
});

test("stops sending events after unsubscribe", () => {
  const subscriber1 = jest.fn();
  const subscriber2 = jest.fn();

  eventBus.subscribe(subscriber1);
  eventBus.subscribe(subscriber2);
  eventBus.unsubscribe(subscriber1);

  eventBus.publish("myEvent", { arg: "1" });

  expect(subscriber2).toBeCalledWith({
    id: "myEvent",
    data: { arg: "1" },
    updatedAt: NOW
  });
  expect(subscriber1).not.toBeCalled();
});
