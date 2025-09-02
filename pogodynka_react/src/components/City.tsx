import React, { Component } from "react";

interface CityProps {
  temp_min: number;
  temp_max: number;
  lat: number;
  lon: number;
  tm: number;
  text1: string;
  text2: string;
  img: string;
  city: string;
  temp: number;
}

interface CityState {
  temp_min: number;
  temp_max: number;
  lat: number;
  lon: number;
  tm: number;
  text1: string;
  text2: string;
  img: string;
  city: string;
  temp: number;
}

class City extends Component<CityProps, CityState> {
  constructor(props: CityProps) {
    super(props);
  }

  formatTime(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  render(): JSX.Element {
    const { city, tm, lat, lon, temp, img, text1, text2, temp_max, temp_min } = this.props;
  console.log(`render city ${city}, ${this.props.city}`)
    return (
      <>
        <div className="city-data">
          <div className="content-column">
            <div>
              <b>{city}</b> ({this.formatTime(tm)})
            </div>
            <div>
              <p>lat: {lat}° &nbsp; lon: {lon}°</p>
            </div>
          </div>
        </div>
        <div className="content-row">
          <div className="temperature-container">
            <div className="content-row">
              <div className="main-temp">
                <div className="content-row">
                  <b>{parseInt((temp - 273.15).toString())}°C</b> &nbsp;
                  <img
                    className="weather-icon"
                    src={`https://openweathermap.org/img/w/${img}.png`}
                    alt="Ikona pogody"
                  />
                </div>
              </div>
              <div className="general-temp">
                <b>{text1}</b>
                <div>{text2}</div>
              </div>
            </div>
            <div className="amp-temp">
              <div>Max: {parseInt((temp_max - 273.15).toString())}°C &nbsp;</div>
              <div>Min: {parseInt((temp_min - 273.15).toString())}°C</div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default City;
