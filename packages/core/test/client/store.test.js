import store, { dashblingConnected, eventReceived } from "../../client/store";
const NOW = new Date();

test("sets connected state", () => {
  store.dispatch(dashblingConnected(true));
  expect(store.getState()).toHaveProperty("connected", true);

  store.dispatch(dashblingConnected(false));
  expect(store.getState()).toHaveProperty("connected", false);
});

test("stores latest events per type", () => {
  store.dispatch(eventReceived("myEvent", { some: "data" }, NOW));
  store.dispatch(eventReceived("myEvent", { some: "data2" }, NOW));

  expect(store.getState().data).toHaveProperty("myEvent", { some: "data2" });
  expect(store.getState()).toHaveProperty("lastUpdatedAt", NOW);
});
