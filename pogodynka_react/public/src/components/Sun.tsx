import React, { Component } from "react";
import sunLine from "../assets/sun_line.png";
import sun from "../assets/sun.png";

interface SunProps {
  sunrise: number;
  sunset: number;
}

interface SunState {
  sunrise: number;
  sunset: number;
  visible: boolean;
  list: any[]; // Możesz doprecyzować typ, jeśli wiesz co znajduje się w liście
}

class Sun extends Component<SunProps, SunState> {
  constructor(props: SunProps) {
    super(props);
    this.state = {
      sunrise: props.sunrise,
      sunset: props.sunset,
      visible: true,
      list: [],
    };
  }


  formatTime(timestamp: number): string {
    const date = new Date(timestamp * 1000); // konwersja na milisekundy
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  calcSunPosition(): void {
    const { sunrise, sunset } = this.props;
    const dayLength = sunset - sunrise;
    const currentTimestamp = Date.now() / 1000;

    if (currentTimestamp < sunrise || currentTimestamp > sunset) {
      this.setState((prevState) => ({ ...prevState, visible: false }));
    } else {
      const timeSinceSunrise = currentTimestamp - sunrise;
      const angle = -90 + (timeSinceSunrise / dayLength) * 180;

      this.setState((prevState) => ({ ...prevState, visible: true }));

      const sunElement = document.querySelector(".sun") as HTMLImageElement | null;
      if (sunElement) {
        sunElement.style.transform = `rotate(${angle}deg)`;
      }
    }
  }

  componentDidMount() {
    this.calcSunPosition();
  }

  render() {
    const { visible } = this.state;
    const { sunrise, sunset } = this.props;

    return (
      <div className="content-row">
        <div className="sun-container">
          <div className="content-row">
            <div className="sun-text">{this.formatTime(sunrise)}</div>
            <div className="merge-sun">
              <img className="sun-line" src={sunLine} alt="Linia słońca" />
              {visible && <img className="sun" src={sun} alt="Słońce" />}
            </div>
            <div className="sun-text">{this.formatTime(sunset)}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Sun;
