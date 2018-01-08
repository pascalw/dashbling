import "./react.setup";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { createStore } from "redux";
import { Provider } from "react-redux";

import { mount } from "enzyme";
import { Dashboard } from "../components/Dashboard";
import flexLayout from "../layouts/FlexLayout.scss";

const store = createStore(state => state, {});

const createContextSpy = spy => {
  const component = (props, context) => {
    spy(context);
    return <div />;
  };
  component.contextTypes = { layout: PropTypes.object };
  return component;
};

test("passes custom layout to children", () => {
  let layout = {
    widget: "myWidgetClass"
  };

  const contextReceiver = jest.fn();
  const ContextSpy = createContextSpy(contextReceiver);

  mount(
    <Provider store={store}>
      <Dashboard layout={layout}>
        <ContextSpy />
      </Dashboard>
    </Provider>
  );

  const receivedContext = contextReceiver.mock.calls[0][0];
  expect(receivedContext.layout).toEqual(layout);
});

test("uses flex layout by default", () => {
  const contextReceiver = jest.fn();
  const ContextSpy = createContextSpy(contextReceiver);

  mount(
    <Provider store={store}>
      <Dashboard>
        <ContextSpy />
      </Dashboard>
    </Provider>
  );

  const receivedContext = contextReceiver.mock.calls[0][0];

  // JSON.stringify because mocked css module cannot be compared using toEqual :(
  expect(JSON.stringify(receivedContext.layout)).toEqual(
    JSON.stringify(flexLayout)
  );
});
