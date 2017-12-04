import { connect as connectRedux } from "react-redux";
import { eventReceived, dashblingConnected } from "./store";

export const connectStoreToDashbling = store => {
  const eventSource = new EventSource("/events");

  let wasConnected = false;
  let reconnectTimer = null;

  eventSource.onopen = function() {
    // Reload if we were connected before.
    // This will happen during deploys
    // so this will make sure that after a deploy new widgets are loaded.
    if (wasConnected) location.reload(true);

    wasConnected = true;
    store.dispatch(dashblingConnected(true));
    console.info("Connected to Dashbling ✅");
  };

  eventSource.onmessage = function(e) {
    const eventData = JSON.parse(e.data);
    const id = eventData.id;
    const data = eventData.data;

    store.dispatch(eventReceived(id, data));
  };

  eventSource.onerror = function() {
    store.dispatch(dashblingConnected(false));

    reconnectTimer && clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(function() {
      // onerror the browser will try to reconnect in most cases, but not all.
      // When the browser succesfully reconnects it will call onopen again, causing the
      // page to reload. If the browser doesn't reconnect within 30s we're going to manually
      // try reconnecting to the event stream. This is to prevent the frontend getting
      // into a state where the connection is lost and will never reconnect again.
      console.warn("Trying to reconnect to Dashbling after connection failure");
      eventSource.close();
      connectStoreToDashbling(store);
    }, 30000);
  };
};

export const connect = id =>
  connectRedux((state, ownProps) => (state.data && state.data[id]) || {});
