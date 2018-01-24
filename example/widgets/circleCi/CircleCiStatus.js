import React from "react";
import { Widget, LargeLabel, MediumLabel } from "@dashbling/client/Widget";

const bgColor = props => {
  return props.outcome === "success" ? "#429c6a" : "#dd1506";
};

export const CircleCiStatus = props => {
  return (
    <Widget
      bgImage={require("./circleci.svg")}
      style={{ backgroundColor: bgColor(props) }}
      href={props.buildUrl}
    >
      <LargeLabel>{props.repo}</LargeLabel>
      <MediumLabel>{props.outcome}</MediumLabel>
    </Widget>
  );
};
