import React, { Component } from "react";

interface PressureProps {
  pressure: number;
}

interface PressureState {
  min: number;
  max: number;
  pressure: number;
}

class Pressure extends Component<PressureProps, PressureState> {
  constructor(props: PressureProps) {
    super(props);
  }

  componentDidUpdate(): void {
    const pressure = this.props.pressure;
    const min = 870;
    const max = 1086;
    const range = max - min;
    const current = pressure - min;
    let proc = Math.min(((current * 100) / range), 100);

    const pointer = document.querySelector(".pressure-pointer") as HTMLDivElement | null;
    if (pointer) {
      pointer.style.height = `${proc}%`;
    }
  }

  render(): JSX.Element {
    
    return (
      <div className="pressure-container">
        <div className="data"><b>Ciśnienie</b></div>
        <div className="data-center">{this.props.pressure} mBar</div>
        <div className="content-row">
          <div className="merge-images">
            <div className="pressure-gauge"></div>
            <div className="pressure-pointer"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Pressure;
