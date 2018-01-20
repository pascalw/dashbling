import React from "react";

const ctx = require.context("./climacons/", false, /\.svg$/);
const ICONS = ctx.keys().reduce(function(acc, file) {
  const id = file.match(/.\/(.*)\.svg$/)[1];
  acc[id] = ctx(file);
  return acc;
}, {});

export const Climacon = props => {
  return <img style={props.style} src={ICONS[props.id]} />;
};
