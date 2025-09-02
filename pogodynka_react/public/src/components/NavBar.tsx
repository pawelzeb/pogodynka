import React, { Component } from "react";
import Weather from "./Weather.tsx";
import Forecast from "./Forecast.js";
import History from "./History.js";

interface NavBarProps {
  action: (type: string) => void;
}

interface NavBarState {
  city: string;
  cc: string;
  type: string;
}

interface MenuOptionProps {
  id: string;
  type: string;
  select: string;
  src: string;
  action: (type: string) => void;
  children?: React.ReactNode;
}

class NavBar extends Component<NavBarProps, NavBarState> {
  private component: JSX.Element | null = null;

  constructor(props: NavBarProps) {
    super(props);
    const city = localStorage.getItem('weather_city');
    const cc = localStorage.getItem('weather_cc');
    this.state = {
      city: city == null?"":city,
      cc: cc == null?"":cc,
      type: "weather",
    };
    this.menuItemSelectedHandler = this.menuItemSelectedHandler.bind(this);
    this.selectedCity = this.selectedCity.bind(this);
  }

  menuItemSelectedHandler(type: string): void {
    this.setState({ ...this.state, type });
    this.props.action(type);
  }

  selectedCity(city: string, cc: string): void {
    this.setState(prev =>({ ...prev, city, cc }));
  }

  render(): JSX.Element {
    const {  type,city, cc } = this.state;
    const { action } = this.props;

    switch (type) {
      case "weather":
        this.component = (<Weather action={action} citySelected={this.selectedCity} city={city} cc={cc} />);
        break;
      case "forecast":
        this.component = <Forecast city={city} cc={cc} action={action} />;
        break;
      case "history":
        this.component = <History action={action}  city={city} cc={cc}/>;
        break;
      default:
        // this.component = <Weather action={action} citySelected={this.selectedCity} />;
        this.component = (<Weather action={action} citySelected={this.selectedCity} city={city} cc={cc} />);
        break;
    }

    return (
      <>
        <div id="toolbar" className="menu-container">
          <MenuOption id="weather" type="weather" select={type} src="Pogoda" action={this.menuItemSelectedHandler}>
            Pogoda
          </MenuOption>
          <MenuOption id="forecast" type="forecast" select={type} src="Prognoza" action={this.menuItemSelectedHandler}>
            Prognoza
          </MenuOption>
          <MenuOption id="history" type="history" select={type} src="Historia" action={this.menuItemSelectedHandler}>
            Historia
          </MenuOption>
        </div>
        {this.component}
        <div className="pogodynka-footer">
          <p className="">Stopka</p>
        </div>
      </>
    );
  }
}


class MenuOption extends Component<MenuOptionProps> {
  click = (type: string): void => {
    this.props.action(type);
  };

  render(): JSX.Element {
    const { id, type, select, src } = this.props;
    return (
      <>
        <button
          id={id}
          onClick={() => this.click(type)}
          className={"toolbutton " + (select == id ? "btn-selected " : " ")}  //dodaj klasę wyróżniającą seleckę przycisku
        >
          {src}
        </button>
      </>
    );
  }
}

export default NavBar;
