import "./react.setup";
import React from "react";
import { shallow } from "enzyme";

import { Widget } from "../Widget";

describe("class name", () => {
  test("builds className from styles and context", () => {
    const wrapper = shallow(<Widget />, {
      context: { layout: { widget: "widgetContextClass" } }
    });
    expect(wrapper.prop("className")).toEqual("widget widgetContextClass");
  });

  test("appends className from prop", () => {
    const wrapper = shallow(<Widget className="propClassName" />, {
      context: { layout: { widget: "widgetContextClass" } }
    });
    expect(wrapper.prop("className")).toEqual(
      "widget widgetContextClass propClassName"
    );
  });
});
