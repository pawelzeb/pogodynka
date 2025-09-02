import {Component} from "react"
import DailyForecast from "./DailyForecast";
import WeatherInput from "./WeatherInput.tsx";

class Forecast extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: null,
            city: props.city,
            cc: props.cc,
            error: null
        }
        console.log(props.city)
        this.getForecastRequest = this.getForecastRequest.bind(this);
    }

    async getForecastRequest(city,cc) {
      console.log(`city forecast ${city}`)
      let url = `http://localhost:4000/forecast/${city}/${cc}`
      let result = null;
      result = fetch(url, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
        },
        method: 'GET',
      }).then(response => {return response.json()}).then( responseData => {
          console.log(responseData)
          if(responseData.code && responseData.code == 404) {
            this.setState(prev => ({ ...prev,  error: responseData.error}));
            return null
          }
          else {
            this.setState(prev => ({ ...prev, data: responseData,  city:city,  cc:cc, error: null}));
            return responseData;
          }
        })
        return result
    }


    render() {
      const { data, city, cc, error } = this.state;

      console.log(`render forecast ${city} ${data}`)
      if(error && error.length > 0) {
          return (
            <div className="content-row">
              <div className="content-column">
                <WeatherInput action={this.getForecastRequest} city={city} cc={cc} subscribe={false} actionCSV={null}/>
                <h2 style={{color: `#910909`}}><b> {error}😔</b></h2>
              </div>
            </div>)  
          }
        if(!data) {
            return <WeatherInput action={this.getForecastRequest} city={city} cc={cc} subscribe={false} actionCSV={null}/>
        }
        
        return (
            <>
            <WeatherInput action={this.getForecastRequest} city={city} cc={cc} subscribe={false} actionCSV={null}/>
            <div className="content-row">
                <div className="content-column">
                    <DailyForecast name={city} data={data.list}/>
                </div>
            </div>
            </>
        );
    }
    componentDidMount() {
        if(this.props.city) {
            this.getForecastRequest(this.props.city, this.props.cc)
        }

    }
}

export default Forecast;