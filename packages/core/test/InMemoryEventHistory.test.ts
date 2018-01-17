import { createHistory } from "../src/lib/InMemoryEventHistory";

test("stores latest event per id", async () => {
  const history = await createHistory();

  const myEvent1 = {
    id: "myEvent",
    data: { first: "event" },
    updatedAt: new Date()
  };
  history.put(myEvent1);

  expect(history.get()).toEqual([myEvent1]);

  const myEvent2 = {
    id: "myEvent",
    data: { second: "event" },
    updatedAt: new Date()
  };
  history.put(myEvent2);

  expect(history.get()).toEqual([myEvent2]);

  const anotherEvent = { id: "anotherEvent", data: {}, updatedAt: new Date() };
  history.put(anotherEvent);

  expect(history.get()).toEqual([myEvent2, anotherEvent]);
});
