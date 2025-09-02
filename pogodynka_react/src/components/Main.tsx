import React, { Component, createRef } from "react";
import NavBar from "./NavBar.tsx";




interface MainProps {}

interface MainState {}

class Main extends Component<MainProps, MainState> {
  navbar: React.RefObject<typeof NavBar>;

  constructor(props: MainProps) {
    super(props);
    this.itemPicked = this.itemPicked.bind(this);
    this.navbar = createRef();
  }
    
  itemPicked(type: string, param?: any): void {
    switch (type) {
      case "weather":
        // alert("weather");
        break;
      case "forecast":
        // alert("forecast");
        break;
      case "history":
        // alert("history");
        break;
      default:
        break;
    }
  }

  render(): JSX.Element {
    return (
      <>
        <NavBar action={this.itemPicked} ref={this.navbar} />
      </>
    );
  }
}

export default Main;
