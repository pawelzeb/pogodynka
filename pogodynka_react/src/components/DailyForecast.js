import {Component} from "react"


class DailyForecast extends Component {
    constructor(props) {
        super(props);

        
        this.state = {
            city: props.name,
            data: props.data != null?this.calcData(props.data):null,
        }
    }
    calcData(data) {
        const list = []
        const week = ["Niedziela","Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"]

        const today = new Date().getUTCDay();
        data.forEach( d => {
            const timestamp = d.dt
            const date = new Date(timestamp * 1000); // konwersja na milisekundy
            const day = date.getUTCDay()
            // if(day == today) return
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const formattedTime = `${hours}:${minutes}`;
            let indx = day - (today + 1)
            if(day < today)
                indx = day + 6 % today
            
            if(list[indx] === undefined) {
                list[indx] = {day:week[day], data:[]}
            }
            list[indx].data.push({img: d.weather[0].icon, temp: parseInt(d.main.temp- 273.15), dt:formattedTime})
        })
        return list
    }
     render() {
       if (!this.props.data) {
         return <></>
      }
        const city = this.props.name
        const data = this.calcData(this.props.data)
        return (
            <>
            <div className="title">{city}</div>
            {
                data.map(day =>
                    <div className="forecast-container" key={day.day}>
                        <div className="forecast-data" ><b>{day.day}</b></div>
                            <div className="content-row left">

                                {day.data.map( (dat, indx) =>
                                
                                <div className="forecast-segment" key={indx}>
                                    <div>{dat.dt}</div>
                                    <img className="forecast-icon" src={`https://openweathermap.org/img/w/${dat.img}.png`} alt=" img"/>   
                                    <div>{dat.temp }°C</div>
                                </div>
                                )}
                        </div>
                    </div>
                    )
             }
             </>
        );
    }
}

export default DailyForecast;