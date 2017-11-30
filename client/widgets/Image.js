import React from "react";
import Widget from "./Widget";

const styles = {
  padding: "1.5em",
  background: "transparent",
  textAlign: "center"
};

export const Image = props => {
  return (
    <Widget style={Object.assign({}, styles, props.style)}>
      <img src={props.src} style={{ maxWidth: "100%", maxHeight: "100%" }} />
    </Widget>
  );
};
