import {Component} from "react"
import wind_dir from "../assets/wind_dir.png"
import WeatherInput from "./WeatherInput.tsx";

class History extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: null,
            city: props.city,
            cc: props.cc,
            error: null,
        };
        this.getWeekdayName = this.getWeekdayName.bind(this);
        this.formatTime = this.formatTime.bind(this);
        this.getHistoricalData = this.getHistoricalData.bind(this);
        this.getDataRequest = this.getDataRequest.bind(this);
        this.groupByDay = this.groupByDay.bind(this);
        this.printToCSVFile = this.printToCSVFile.bind(this);
    }
    windClass() {

        const windRow = document.querySelector("table tbody tr:nth-child(1)"); // zakładamy wind to pierwszy wiersz
        if(!windRow) return
        const windCells = windRow.querySelectorAll("td");
        if(!windCells) return

        windCells.forEach((cell) => {
            const value = parseFloat(cell.textContent);
            if (!isNaN(value)) {
                if (value < 25) {
                    cell.classList.add("wind-calm");
                } else if (value < 50) {
                    cell.classList.add("wind-medium");
                } else {
                    cell.classList.add("wind-strong");
                }
            }
        });
    }
    groupByDay(response) {
        const grouped = {};

        response.forEach(entry => {
            const unixTime = entry.dt;
            const date = new Date(unixTime * 1000); // konwersja z sekund na milisekundy
            const dayKey = date.toISOString().split('T')[0]; // yyyy-mm-dd

            if (!grouped[dayKey]) {
                grouped[dayKey] = [];
            }
            grouped[dayKey].push(entry);
        });

        // Zamieniamy obiekt grouped w tablicę tablic wpisów
        const result = Object.values(grouped);
        return result;
    }

    async getDataRequest(city, cc) {
        let url = `http://localhost:4000/history/${city}/${cc}`
        let result = null;
        result = fetch(url, {
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
            method: 'GET',
        }).then(response => {
            return response.json()
        }).then(responseData => {
            if(responseData.code && responseData.code == 404) {

                console.log(responseData)
                this.setState( prev => ({...prev, error: responseData.error}))
                return null
            }
            
            return this.groupByDay(responseData);
        })
        return result
    }
    async getHistoricalData(city, cc) {
        console.log(`getHistoricalData(${city})`)
        let response = await this.getDataRequest(city, cc)
        if(response)
            this.setState({
                data: response,
                city: city,
                cc: cc,
                error: null,
            });
        console.log(response)
    }
    formatTime(timestamp) {
        const date = new Date(timestamp * 1000); // konwersja na milisekundy
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    }
    formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        // const formatted = formatDate(date); // "21/07/2025"
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0'); // miesiące 0–11
        const yyyy = date.getFullYear();
        const day = date.toLocaleDateString('pl-PL', {
            weekday: 'long'
        });
        return `${day}  ${dd}/${mm}/${yyyy}`;
    }


    componentDidMount() {
        if(this.props.city)
            this.getHistoricalData(this.props.city, this.props.cc)
    }
    componentDidUpdate() {
        this.swipeTableJS()
    }
    swipeTableJS() {
        this.windClass()
        const el = document.getElementById("tableWrapper");
        if (el == null) return
        let isDown = false;
        let startX, scrollLeft;
        let velocity = 0;
        let animationFrame;

        el.addEventListener("mousedown", (e) => {
            isDown = true;
            startX = e.clientX;
            scrollLeft = el.scrollLeft;
            velocity = 0;
            cancelAnimationFrame(animationFrame);
            el.classList.add("grabbing");
        });

        el.addEventListener("mouseup", () => {
            isDown = false;
            el.classList.remove("grabbing");
            animateInertia();
        });

        el.addEventListener("mouseleave", () => {
            if (isDown) {
                isDown = false;
                el.classList.remove("grabbing");
                animateInertia();
            }
        });

        el.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            const x = e.clientX;
            const dx = x - startX;
            el.scrollLeft = scrollLeft - dx;
            velocity = dx; // zapisz prędkość
        });

        // efekt inercji po puszczeniu
        function animateInertia() {
            velocity *= 0.85;
            if (Math.abs(velocity) > 0.35) {
                el.scrollLeft -= velocity;
                animationFrame = requestAnimationFrame(animateInertia);
            }
        }
    }
    printToCSVFile() {
        console.log(this.state.data)
        let csv = ""
        csv +=`data;czas;opis1;opis2;temperatura;temp_max;temp_min;wilgotność;\n`
        this.state.data.forEach(d => {
            d.forEach( data => {
                csv +=`${this.formatDate(data.dt)};${this.formatTime(data.dt)};${data.main_weather};${data.description};${Math.round(data.temp -  273.15)};${Math.round(data.temp_max -  273.15)};${Math.round(data.temp_min -  273.15)};${Math.round(data.humidity)};\n`
            }

            )
        })
        const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.download = `${this.state.city}.txt`;
        a.href = URL.createObjectURL(blob);
        a.addEventListener('click', (e) => {
            setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
        });
        a.click();
    
    }
    getWeekdayName(unixTime) {
        const date = new Date(unixTime * 1000); // konwersja do milisekund
        return date.toLocaleDateString('pl-PL', {
            weekday: 'long'
        }); // polska nazwa dnia
    }
    render() {
        const { data, city, cc, error } = this.state;
        console.log(`render History ${error}`)
        if(error) {
            return (
                  <div className="content-row">
                    <div className="content-column">
                      <WeatherInput action={this.getHistoricalData} city={city} cc={cc} subscribe={false} actionCSV={null}/>
                      <h3 style={{color: `#910909`}}><b> {error}😔</b></h3>
                    </div>
                  </div>)  
        }
      console.log(`render forecast ${city}`)
        if(!data) {
            return <WeatherInput action={this.getHistoricalData} city={city} cc={cc} subscribe={false} actionCSV={null}/>
        }
        return ( 
            <>
            <WeatherInput action={this.getHistoricalData} city={city} cc={cc} subscribe={false} actionCSV={this.printToCSVFile}/>
        <div className="content-row">
                <div className="title">{city}</div>
            <div className="drag-scroll" id="tableWrapper">
            <table>
            <thead>
                <tr>
                <th></th>
                {data.map((day, i) => 
                    <th colSpan={day.length} key={i}>{this.formatDate(day[0].dt)}</th>
                )}
                </tr>
                <tr>
                <th></th>
                {data.map((day, i) => 
                    day.map((col, j) =>
                        <th key={(i+day.length)*j}>{this.formatTime(col.dt)}</th>
                    )
                )}
                </tr>
                <tr>
                <th></th>
                {data.map((day, i) => 
                    day.map((col, j) =>
                        // <th key={(i+day.length)*j}>v</th>
                
                        <td key={(i+day.length)*j}><img src={`https://openweathermap.org/img/w/${col.icon}.png`} alt="img" /><div>{col.main_weather}</div></td>
                    )
                )}

                </tr>

            </thead>
            <tbody>
                <tr>
                <th>wind💨</th>
                {data.map((day, i) => 
                    day.map((col, j) =>
                        <td key={(i+day.length)*j} ><div className="wind-cell"><img className="wind-dir" src={wind_dir} style={{ transform: `rotate(${col.wind_deg}deg)` }} alt="img"/>{parseInt(col.wind_speed * 3.6)}</div></td>
                    )
                )}

                </tr>
                <tr>
                <th>temp 🌡️</th>
                {data.map((day, i) => 
                    day.map((col, j) =>
                        <td key={(i+day.length)*j} ><div className="wind-cell">{Math.round(col.temp - 273.15)}°C</div></td>
                    )
                )}
                </tr>
                <tr>
                <th>max🌡️</th>
                {data.map((day, i) => 
                    day.map((col, j) =>
                        <td key={(i+day.length)*j} ><div className="wind-cell">{Math.round(col.temp_max - 273.15)}°C</div></td>
                    )
                )}
                </tr>
                <tr>
                <th>min🌡️</th>
                {data.map((day, i) => 
                    day.map((col, j) =>
                        <td key={(i+day.length)*j} ><div className="wind-cell">{Math.round(col.temp_min - 273.15)}°C</div></td>
                    )
                )}
                </tr>
                <tr>
                <th>wilgotność💦</th>
                {data.map((day, i) => 
                    day.map((col, j) =>
                        <td key={(i+day.length)*j} ><div className="wind-cell">{Math.round(col.humidity)}%</div></td>
                    )
                )}
                </tr>
            </tbody>
            </table>
            </div>
      </div>
      </>
      );
    }
}


export default History;