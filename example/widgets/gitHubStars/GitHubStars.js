import React from "react";
import {
  Widget,
  SmallLabel,
  MediumLabel,
  LargeLabel
} from "@dashbling/client/Widget";

export const GitHubStars = ({ full_name, stargazers_count }) => {
  if (stargazers_count === undefined) return null;

  return (
    <Widget
      bgImage={require("./github.svg")}
      style={{ backgroundColor: "#24292e" }}
      href={`https://github.com/${full_name}`}
    >
      <LargeLabel>{stargazers_count} stars</LargeLabel>
      <SmallLabel>{full_name}</SmallLabel>
    </Widget>
  );
};
