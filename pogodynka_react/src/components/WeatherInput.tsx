import React, { Component, ChangeEvent, KeyboardEvent } from "react";

interface WeatherInputProps {
  cc: string;
  city: string;
  subscribe: number;
  action?: (city: string, cc: string) => void;
  actionFollow?: () => void;
  actionCSV?: () => void;
}

interface WeatherInputState {
  list: any[]; // Możesz sprecyzować typ, np. listę miast lub wyników
  cc: string;
  subscribe: number;
  city: string;
}

class WeatherInput extends Component<WeatherInputProps, WeatherInputState> {
  constructor(props: WeatherInputProps) {
    super(props);
    this.state = {
      list: [],
      cc: props.cc,
      subscribe: props.subscribe,
      city: props.city,
    };

    this.handleInputChangeCity = this.handleInputChangeCity.bind(this);
    this.handleInputChangeCC = this.handleInputChangeCC.bind(this);
  }

  click = (): void => {
    const { action } = this.props;
    const { city, cc } = this.state;
    console.log(`city: ${city}`)
    if (typeof action === "function") {
      action(city, cc);
    } else {
      console.warn("Brak funkcji action w propsach", action);
    }
  };

  follow = (): void => {
    //this.notify('Powiadomienia włączone')

    const { actionFollow } = this.props;
    const { city, cc } = this.state;
    console.log(`city: ${city}`)

    // localStorage.setItem("follow_cities", JSON.stringify([]))
    // return
    if (typeof actionFollow === "function") {
      actionFollow();
    } else {
      console.warn("Brak funkcji actionFollow w propsach", actionFollow);
    }
  };
    notify(msg:string) {
    if (Notification.permission === 'granted') {
      new Notification('Pogoda', {
        body: `${msg}`,
        icon: 'sun.png'
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Pogoda', {
            body: `${msg}`,
            icon: 'sun.png'
          });
        }
      });
    }
    }
  handleInputChangeCity(event: ChangeEvent<HTMLInputElement>): void {
    this.setState((prev) => ({ ...prev, city: event.target.value }));
  }

  handleInputChangeCC(event: ChangeEvent<HTMLInputElement>): void {
    this.setState((prev) => ({ ...prev, cc: event.target.value }));
  }

  render(): JSX.Element {
    return (
      <div className="content-row center">
        <input
          type="text"
          placeholder="Podaj lokację..."
          className="pill-input"
          onChange={this.handleInputChangeCity}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              this.click();
            }
          }}
        />
        <input
          type="text"
          value={this.state.cc}
          className="pill-input narrow"
          onChange={this.handleInputChangeCC}
        />
        <button id="go" className="pill-button" onClick={this.click}>
          GO
        </button>
        {this.props.subscribe == 1 &&
        <button id="follow" className="pill-button follow" onClick={this.follow}>
          <b>+</b>Obserwuj
        </button>
        }
        {this.props.subscribe == 2 &&
          <button id="unfollow" className="pill-button unfollow" onClick={this.follow}>
          <b>-</b>Obserwuj
        </button>

        }
        {this.props.actionCSV !== null  &&
        <button id="csv" className="pill-button" onClick={this.props.actionCSV}>
         CSV
        </button>
        }

      </div>
    );
  }
}

export default WeatherInput;
