import React from "react";
import PropTypes from "prop-types";
import flexLayout from "../layouts/FlexLayout.scss";
import LastUpdatedAt from "../widgets/LastUpdatedAt";
import DashblingConnected from "../widgets/DashblingConnected";

const MetaContainer = props => {
  return (
    <div className={props.layout.metaContainer}>
      <DashblingConnected />
      <LastUpdatedAt />
    </div>
  );
};

const WidgetContainer = props => {
  return <div className={props.layout.widgetContainer}>{props.children}</div>;
};

export class Dashboard extends React.Component {
  getChildContext() {
    return { layout: this.props.layout };
  }

  render() {
    const { layout } = this.props;

    return (
      <div className={layout.dashboard}>
        <WidgetContainer layout={layout}>{this.props.children}</WidgetContainer>

        <MetaContainer layout={layout} />
      </div>
    );
  }
}

Dashboard.defaultProps = {
  layout: flexLayout
};

Dashboard.childContextTypes = {
  layout: PropTypes.object
};
