import React from "react";
import Widget, { MediumLabel, LargeLabel } from "../Widget";
import tz from "timezone";

const dateFormatter = (tzdata, timezone, format) => date => {
  return tz(tzdata)(date, format, "en_US", timezone);
};

export const Clock = class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { time: new Date() };

    this.formatDate = dateFormatter(
      props.tzdata,
      props.timezone,
      "%a %b %e %Y"
    );
    this.formatTime = dateFormatter(props.tzdata, props.timezone, "%H:%M");
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.setState({ time: new Date() }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return (
      <Widget style={{ backgroundColor: this.props.backgroundColor }}>
        <MediumLabel>{this.formatDate(this.state.time)}</MediumLabel>

        <LargeLabel style={{ marginTop: "10px" }}>
          {this.formatTime(this.state.time)}
        </LargeLabel>

        {this.props.title && <MediumLabel>{this.props.title}</MediumLabel>}
      </Widget>
    );
  }
};

Clock.defaultProps = {
  backgroundColor: "#359c94"
};
