import React from "react";
import { Widget, MediumLabel } from "@dashbling/client/Widget";

const truncate = value =>
  value.length < 30 ? value : value.substring(0, 30) + "...";

export const HelloWidget = props => (
  <Widget style={{ backgroundColor: "#FB8C00" }}>
    <MediumLabel>Hello {truncate(props.name || "world")}</MediumLabel>
  </Widget>
);
