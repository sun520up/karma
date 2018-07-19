import React, { Component } from "react";
import PropTypes from "prop-types";

import { observer } from "mobx-react";

import Moment from "react-moment";

import { GetLabelColorClass } from "Common/Colors";
import { StaticLabels } from "Common/Query";
import { FilteringLabel } from "Components/Labels/FilteringLabel";
import { RenderNonLinkAnnotation, RenderLinkAnnotation } from "../Annotation";
import { Silence } from "../Silence";

import "./index.css";

const Alert = observer(
  class Alert extends Component {
    static propTypes = {
      alert: PropTypes.object.isRequired,
      showAlertmanagers: PropTypes.bool.isRequired,
      showReceiver: PropTypes.bool.isRequired,
      afterUpdate: PropTypes.func.isRequired
    };

    render() {
      const {
        alert,
        showAlertmanagers,
        showReceiver,
        afterUpdate
      } = this.props;

      let classNames = [
        "components-grid-alertgrid-alertgroup-alert",
        "list-group-item",
        "pl-1 pr-0 py-0",
        "my-1",
        "rounded-0",
        "border-left-1 border-right-0 border-top-0 border-bottom-0",
        `border-${GetLabelColorClass(StaticLabels.State, alert.state)}`
      ];

      return (
        <li className={classNames.join(" ")}>
          <div className="mb-1">
            {alert.annotations
              .filter(a => a.isLink === false)
              .map(a => (
                <RenderNonLinkAnnotation
                  key={a.name}
                  name={a.name}
                  value={a.value}
                />
              ))}
          </div>
          <span className="text-nowrap text-truncate px-1 mr-1 badge badge-secondary">
            <Moment fromNow>{alert.startsAt}</Moment>
          </span>
          {Object.entries(alert.labels).map(([name, value]) => (
            <FilteringLabel key={name} name={name} value={value} />
          ))}
          {showAlertmanagers
            ? alert.alertmanager.map(am => (
                <FilteringLabel
                  key={am.name}
                  name={StaticLabels.AlertManager}
                  value={am.name}
                />
              ))
            : null}
          {showReceiver ? (
            <FilteringLabel
              name={StaticLabels.Receiver}
              value={alert.receiver}
            />
          ) : null}
          {alert.annotations
            .filter(a => a.isLink === true)
            .map(a => (
              <RenderLinkAnnotation
                key={a.name}
                name={a.name}
                value={a.value}
              />
            ))}
          {alert.alertmanager.map(am =>
            am.silencedBy.map(silenceID => (
              <Silence
                key={silenceID}
                alertmanager={am}
                silenceID={silenceID}
                afterUpdate={afterUpdate}
              />
            ))
          )}
        </li>
      );
    }
  }
);

export { Alert };
