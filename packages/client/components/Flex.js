import React from "react";
const style = {
  display: "flex",
  width: "100%",
  flexWrap: "wrap"
};

export const Flex = props => {
  return <div style={style}>{props.children}</div>;
};
