import React, { Component } from "react";
import rose from "../assets/rose.png";
import bearing from "../assets/bearing.png";

interface WindProps {
  speed: number;
  deg: number;
}

interface WindState {
  speed: number;
  deg: number;
}

class Wind extends Component<WindProps, WindState> {
  constructor(props: WindProps) {
    super(props);
  }

  render() {
    const { speed, deg } = this.props;
    return (
      <div className="wind-container">
        <div className="data">
          <b>Wiatr</b>
          <br />
          {speed} m/s
        </div>

        <div className="content-row">
          <div className="merge-images">
            <img className="rose-wind" src={rose} alt="Rose" />
            <img className="bearing" src={bearing} style={{ transform: `rotate(${deg}deg)` }} alt="Bearing" />
          </div>
        </div>
      </div>
    );
  }
}

export default Wind;
