
const axios = require('axios')
const Database = require('../db/Database')
const key = '1f7cff01e11e11b2533f9497da9ee055'

const getHistory = async (req, res) => {
    let city = req.params.city;
    const cc = req.params.cc;
    console.log(`Historia z ${city} ${cc}`)
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},${cc}&appid=${key}`)
        console.log(response.data.name);
        //res.json(response.data);
        city = response.data.name
    }
    catch {
        res.json({code: 404, error: `Nie znaleziono lokacji <${city}>/<${cc}>`});
        return
    }
    console.log(`Historia2 z ${city} ${cc}`)
    //TODO: pobieramy dane z bazy danych, przepakowujemy w JSON i wysyłamy do klienta
    try {
        const db = new Database();
        const rows = await db.getForecastCityData(city, cc)
        // res.json({Miasto: city, cc: cc});
        console.log(rows.length)
        if(rows.length <= 0) {
            res.json({code: 404, error: `Brak wpisów dla <${city}>/<${cc}>.Dodaj ${city} do obserwowanych, aby zacząć rejestrować dane meteo`});
        }
        else
            res.json(rows);
    }
    catch {
        res.json({code: 404, error: `Nie znaleziono wpisów dla ${city} w ${cc} w bazie danych`});
    }
}


module.exports = {getHistory}