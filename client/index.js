import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import { connectStoreToDashbling } from "./dashbling";

export const start = root => {
  connectStoreToDashbling(store);
};

export const render = (rootElement, DashboardComponent) => {
  ReactDOM.render(
    <Provider store={store}>
      <DashboardComponent />
    </Provider>,
    rootElement
  );
};
