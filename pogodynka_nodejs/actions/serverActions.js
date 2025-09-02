const admin = require("firebase-admin");
const axios = require('axios')
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
var serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

const fakeFBAlerts = process.argv[2] === 'FB_ALERT';
const Database = require('../db/Database')

const key = '1f7cff01e11e11b2533f9497da9ee055'


const serverSettings1 = (PORT) => {
    console.log(`Serwer Express działa na http://localhost:${PORT}`);
      admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: "https://pogodynka-e398e-default-rtdb.europe-west1.firebasedatabase.app"
      });

    if(fakeFBAlerts) {

      const db = admin.database();
      const ref = db.ref('msg1');
        let linie = readAlerts("rcb.txt")
        let cnt = 0;
        cron.schedule('*/5 * * * * *', () => {
            if(cnt >= linie.length) cnt = 0
            fireRCBAlert(ref, linie[cnt++])
        });
    }
    follow();
}

async function checkForecast(city, cc) {
    try {
        console.log(`Sprawdza anomalia pogodowe w ${city}`, cc)
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city},${cc}&appid=${key}`)
        // console.log(response.data);
        response.data.list = response.data.list.slice(0,8)

        const check = [false, false, false]
        for(f of response.data.list) {
            
            if(check[0] === false && f.rain !== undefined && f.rain["3h"] !== undefined  && f.rain["3h"] > 15) {
                check[0] = true;
                const dt = f.dt_txt.split(" ")[0]
                //firebase komunikat Uwaga ${dt} przewidywane są intensywne opady
                console.log(`Uwaga ${dt} przewidywane są intensywne opady w ${city}`)
                fireRCBAlert(admin.database().ref(city), `Uwaga ${dt} przewidywane są intensywne opady`)
            }
            if(check[1] === false && f.main.temp - 273.15 > 30 ) { //temperatury ponad 30 stopni Celsjusza
                check[1] = true;
                const dt = f.dt_txt.split(" ")[0]
                //firebase komunikat Uwaga ${dt} przewidywane są bardzo wysokie temperatury
                console.log(`Uwaga ${dt} przewidywane są bardzo wysokie temperatury w ${city}`)
                fireRCBAlert(admin.database().ref(city), `Uwaga ${dt} przewidywane są bardzo wysokie temperatury`)
            }
            if(check[2] === false && f.wind.speed > 22 ) {    //Wiatr ponad 80km/h
                //firebase komunikat Uwaga ${dt} przewidywane są bardzo silne wiatry
                const dt = f.dt_txt.split(" ")[0]
                check[2] = true;
                console.log(`Uwaga ${dt} przewidywane są bardzo silne wiatry w ${city}`)
                fireRCBAlert(admin.database().ref(city), `Uwaga ${dt} przewidywane są bardzo silne wiatry`)
            }
        }
    }
    catch(error) {
        console.error("Błąd", error)
    }
}

function follow() {
    // cron.schedule('*/50 * * * * *', () => {  //czytanie follow co 30 sek
    cron.schedule('0 0 * * * *', () => {    //czytanie co pełną godzinę //'0 */15 * * * *' co 15 minut
        (async () => {
        const db = new Database();
        if(db === null) {
            console.error("Brak bazy danych.")
            return;
        }
        const rows = await db.getFollow()
        if(rows == null) {
            console.log(`Zawartość tabelki cities: NULL`)
        }
        else {
            console.log(`liczba miast follow: ${rows.length}`)
            // console.log(`${rows[0][1]}`)
            for(r of rows) {
                const city = r.name;
                const cc = r.cc; //kod kraju
                console.log(`Pobiera info o ${city} z ${cc}`)
                try {
                    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},${cc}&appid=${key}`)
                    db.insertWeatherData(response.data, cc)
                    checkForecast(city,cc)
                }
                catch(error) {
                    console.error("Błąd", error)
                }
            }
        }
    })();
});
}

function fireRCBAlert(ref, msg) {
    // console.log("*",msg);
    ref.set(msg)
    .then(() => {
        console.log(`Zapisano: ${msg}`);
    })
    .catch((error) => {
        console.error('Błąd przy zapisie:', error);
    });

}

function readAlerts(plik) {
  const text = fs.readFileSync(path.resolve(__dirname, plik), 'utf-8');
  const lines = text.split(/\r?\n/); 
  return lines;
}


module.exports = {serverSettings1}