import { createStore } from "redux";

export const EVENT_RECEIVED = "EVENT_RECEIVED";
export const DASHBLING_CONNECTED = "DASHBLING_CONNECTED";

const dashbling = (state = {}, action) => {
  switch (action.type) {
    case EVENT_RECEIVED:
      return Object.assign({}, state, {
        lastUpdatedAt: new Date(action.data.updatedAt * 1000),
        data: Object.assign({}, state.data, { [action.id]: action.data })
      });
    case DASHBLING_CONNECTED:
      return Object.assign({}, state, {
        connected: action.connected
      });
    default:
      return state;
  }
};

export default createStore(
  dashbling,
  {},
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export const dashblingConnected = connected => {
  return { type: DASHBLING_CONNECTED, connected };
};

export const eventReceived = (id, data) => {
  return { type: EVENT_RECEIVED, id: id, data: data };
};
