import React from "react";
const style = {
  display: "flex",
  width: "100%",
  flexWrap: "wrap"
};

export default function(props) {
  return <div style={style}>{props.children}</div>;
}
