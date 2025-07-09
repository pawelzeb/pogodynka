
const Database = require('../db/Database')


const getHistory = async (req, res) => {
    const city = req.params.city;
    const cc = req.params.cc;
    console.log(`Zapytanie o ${city} ${cc}`)
    //TODO: pobieramy dane z bazy danych, przepakowujemy w JSON i wysyłamy do klienta
    try {
        const db = new Database();
        const rows = await db.getForecastCityData(city, cc)
        // res.json({Miasto: city, cc: cc});
        console.log(rows.length)
        if(rows.length <= 0) {
            res.json({code: 404, error: `Nie znaleziono wpisów dla ${city} w ${cc} w bazie danych`});
        }
        else
            res.json(rows);
    }
    catch {
        res.json({code: 404, error: `Nie znaleziono wpisów dla ${city} w ${cc} w bazie danych`});
    }
}


module.exports = {getHistory}