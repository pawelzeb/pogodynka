import React, { useContext, Component } from "react";
import Wind from "./Wind.tsx";
import Pressure from "./Pressure.tsx";
import City from "./City.tsx";
import Sun from "./Sun.tsx";
import WeatherInput from "./WeatherInput.tsx";
import { WeatherContext } from "../provider/WeatherProvider.js";



interface WeatherProps {
  city: string;
  cc: string;
  citySelected: (city: string, cc: string) => void;
}

interface WeatherState {
  weather: any; // Można zastąpić szczegółową strukturą jeśli znane
  city: string;
  cc: string;
  error: string;
  unsubscribe: boolean;
  subscribe: boolean;
}

class Weather extends Component<WeatherProps, WeatherState> {
  
  constructor(props: WeatherProps) {
    super(props);
    this.state = {
      weather: {},
      city: props.city,
      cc: props.cc,
      error: "",
      unsubscribe: false,
      subscribe: false,
    };

    this.followRequest = this.followRequest.bind(this);
    this.follow = this.follow.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.getWeatherRequest = this.getWeatherRequest.bind(this);
  }

  follow() {
    const city = this.state.weather.name
    if(!city)
      return
    // alert(`Follow ${this.state.weather.name}`)
    let list = []
    if(localStorage.getItem("follow_cities"))
      list = JSON.parse(localStorage.getItem("follow_cities")) ?? []
    console.log(list)
    let bFollow = true;
    if(list.includes(city)) {
      //tzn unfollow
      list = list.filter(miasto => miasto != city);
      bFollow = false;
    }
    else  
      list.push(city)
    console.log(list)
    localStorage.setItem("follow_cities", JSON.stringify(list))
    if(bFollow)
      this.followRequest(city, this.state.cc)
    else
      this.unfollowRequest(city, this.state.cc)
    this.forceUpdate();
  }
  /**
   * 
   * @returns sprawdza czy już podążamy za przyciskiem i wraca wartość do WeatherInput jaki przycisk aktywować +/-
   */
  subscribe():number {
    const city = this.state.weather.name
    if(!city)
      return 0
    
    let list = []
    if(localStorage.getItem("follow_cities"))
      list = JSON.parse(localStorage.getItem("follow_cities")) ?? []
    console.log(list)
    if(list.includes(city))
      return 2
      
    return 1
    //this.unfollowRequest(city, this.state.cc)

  }

  async followRequest(city: string, cc: string): Promise<any> {
    console.log(`follow ${city}`)
    const url = `http://localhost:4000/follow/${city}/${cc}`;
    try {
      const response = await fetch(url, {
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PUT",
      });

      const responseData = await response.json();
      
      console.log(responseData)
      if(responseData.code && responseData.code == 404) {
        this.setState(prevState => ({ ...prevState,  error: responseData.error}));
      }
      else {
        this.setState(prevState => ({ ...prevState,  error: null, subscribe: true, unsubscribe: false}));
      }
      console.log(`follow2 ${city}`)
      return responseData;
    } catch (error) {
      console.error("Błąd podczas dodawania miasta do follow:", error);
      return null;
    }
  }
  async unfollowRequest(city: string, cc: string): Promise<any> {
    console.log(`follow ${city}`)
    const url = `http://localhost:4000/follow/${city}/${cc}`;
    try {
      const response = await fetch(url, {
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "DELETE",
      });

      const responseData = await response.json();
      
      console.log(responseData)
      if(responseData.code && responseData.code == 404) {
        this.setState(prevState => ({ ...prevState,  error: responseData.error}));
      }
      else {
        this.setState(prevState => ({ ...prevState,  error: null, subscribe: false, unsubscribe: true}));
      }
      console.log(`follow2 ${city}`)
      return responseData;
    } catch (error) {
      console.error("Błąd podczas dodawania miasta do follow:", error);
      return null;
    }
  }

  async getWeatherRequest(city: string, cc: string): Promise<any> {
    this.setState(prevState => ({ ...prevState,  city:city,  cc:cc, error: ""}));
    localStorage.setItem('weather_city', city);
    localStorage.setItem('weather_cc', cc);
    console.log(`zapisuje ${city}`)

    this.props.citySelected(city, cc);
    console.log(`city: ${city}`)
    const url = `http://localhost:4000/weather/${city}/${cc}`;
    try {
      const response = await fetch(url, {
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
      });

      const responseData = await response.json();
      this.setState(prevState => ({ ...prevState,  weather: responseData}));
      console.log(responseData)
      if(responseData.code && responseData.code == 404) {
        this.setState(prevState => ({ ...prevState,  error: responseData.error}));
      }
      return responseData;
    } catch (error) {
      console.error("Błąd podczas pobierania danych pogodowych:", error);
      return null;
    }
  }

  
  componentDidMount(): void {
    // this.getWeather(); // Można odkomentować do inicjalnej wartości
  }

  render(): JSX.Element {
    const { weather, city, cc, error, subscribe, unsubscribe } = this.state;

    if(error && error.length > 0) {
    return (
      <div className="content-row">
        <div className="content-column">
          <WeatherInput action={this.getWeatherRequest}  city={city} cc={cc} subscribe={this.subscribe()} actionCSV={null}/>
          <h2 style={{color: `#910909`}}><b> {error}😔</b></h2>
        </div>
      </div>)  
    }
    if (!weather || !weather.name) {
      return <WeatherInput action={this.getWeatherRequest} city={city} cc={cc} subscribe={this.subscribe()}  actionCSV={null}/>;
    }
    console.log(`render ${weather.name}`)
    return (
      <div className="content-row">
        <div className="content-column">
          <WeatherInput action={this.getWeatherRequest} actionFollow={this.follow} city={city} cc={cc} subscribe={this.subscribe()}  actionCSV={null}/>
          <City
            city={weather.name}
            temp={weather.main.temp}
            temp_min={weather.main.temp_min}
            temp_max={weather.main.temp_max}
            lat={weather.coord.lat}
            lon={weather.coord.lon}
            tm={weather.dt}
            text1={weather.weather[0].main}
            text2={weather.weather[0].description}
            img={weather.weather[0].icon}
          />
          <div className="content-row">
            <Wind speed={weather.wind.speed} deg={weather.wind.deg} />
            <Pressure pressure={weather.main.pressure} />
          </div>
          <div className="content-row">
            <Sun sunrise={weather.sys.sunrise} sunset={weather.sys.sunset} />
          </div>
          <WeatherContext.Consumer>
            {context => {
              subscribe && context.onSubscribe(city);
              unsubscribe && context.onUnsubscribe(city);
              return null; // albo coś do wyświetlenia
            }}
        </WeatherContext.Consumer>

        </div>
      </div>
    );
  }
}

export default Weather;
