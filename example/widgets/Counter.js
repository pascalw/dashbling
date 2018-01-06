import React from "react";
import { Widget, LargeLabel } from "@dashbling/client/Widget";

export const Counter = class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.setState(state => ({ count: state.count + 1 })),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return (
      <Widget style={{ backgroundColor: "#dd1506" }}>
        <LargeLabel>{this.state.count}</LargeLabel>
      </Widget>
    );
  }
};
