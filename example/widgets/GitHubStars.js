import React from "react";
import Widget, { LargeLabel } from "dashbling/client/widgets/Widget";

export const GitHubStars = ({ stargazers_count }) => {
  if (stargazers_count === undefined) return null;

  return (
    <Widget style={{ backgroundColor: "#24292e" }}>
      <LargeLabel>{stargazers_count}</LargeLabel>
    </Widget>
  );
};
