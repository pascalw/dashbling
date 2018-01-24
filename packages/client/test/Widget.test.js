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

describe("href", () => {
  test("wraps children in anchor if href provided", () => {
    const wrapper = shallow(
      <Widget
        className="propClassName"
        href="https://github.com/pascalw/dashbling"
      />,
      {
        context: { layout: { widget: "widgetContextClass" } }
      }
    );

    const anchor = wrapper.find("a");
    expect(anchor.prop("href")).toEqual("https://github.com/pascalw/dashbling");
    expect(anchor.prop("target")).toEqual("_blank");
  });

  test("does not wrap children if no href provided", () => {
    const wrapper = shallow(<Widget className="propClassName" />, {
      context: { layout: { widget: "widgetContextClass" } }
    });

    expect(wrapper.find("a").length).toEqual(0);
  });
});
