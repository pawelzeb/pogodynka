const admin = require("firebase-admin");
const axios = require('axios')
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
var serviceAccount = require("../serviceAccountkey.json");
const fakeFBAlerts = process.argv[2] === 'FB_ALERT';
const Database = require('../db/Database')

const key = '1f7cff01e11e11b2533f9497da9ee055'


const serverSettings1 = (PORT) => {
    console.log(`Serwer Express działa na http://localhost:${PORT}`);

    if(fakeFBAlerts) {
      admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: "https://pogodynka-e398e-default-rtdb.europe-west1.firebasedatabase.app"
      });
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
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city},${cc}&appid=${key}`)
        console.log(response.data.name);
        response.data.list = response.data.list.slice(0,8)
        for(f of response.data.list) {
            if(f.rain !== undefined && f.rain["3h"] !== undefined  && f.rain["3h"] > 15) {
                //firebase komunikat Uwaga w najbliższych 24h przewidywane są intensywne opady
                console.log(`Uwaga w najbliższych 24h przewidywane są intensywne opady w ${city}`)
                fireRCBAlert(admin.database().ref(city), "Uwaga w najbliższych 24h przewidywane są intensywne opady")
            }
            if(f.main.tem - 273.15 > 30 ) { //temperatury ponad 30 stopni Celsjusza
                //firebase komunikat Uwaga w najbliższych 24h przewidywane są bardzo wysokie temperatury
                console.log(`Uwaga w najbliższych 24h przewidywane są bardzo wysokie temperatury w ${city}`)
                fireRCBAlert(admin.database().ref(city), "Uwaga w najbliższych 24h przewidywane są bardzo wysokie temperatury")
            }
            if(f.wind.speed > 22 ) {    //Wiatr ponad 80km/h
                //firebase komunikat Uwaga w najbliższych 24h przewidywane są bardzo silne wiatry
                console.log(`Uwaga w najbliższych 24h przewidywane są bardzo silne wiatry w ${city}`)
                fireRCBAlert(admin.database().ref(city), "Uwaga w najbliższych 24h przewidywane są bardzo silne wiatry")
            }
        }
        res.json(response.data);
    }
    catch {
        res.json({code: 404, error: `Nie znaleziono lokacji ${city} w ${cc}`});
    }
    
    res.json(response.data);
}

function follow() {
        //czytanie follow co 0.5h
    // cron.schedule('*/10 * * * * *', () => {
    cron.schedule('0 */30 * * * *', () => {
        (async () => {
        const db = new Database();
        const rows = await db.getFollow()
        if(rows == null)
            console.log(`NULL`)
        else 
            console.log(`${rows.length}`)
        console.log(`${rows[0][1]}`)
        for(r of rows) {
            const city = r.name;
            const cc = r.cc; //kod kraju
            console.log(`Pobiera info o ${city} z ${cc}`)
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},${cc}&appid=${key}`)
                db.insertWeatherData(response.data)
                checkForecast(city,cc)
            }
            catch {}

        }
    })();
});
}

function fireRCBAlert(ref, msg) {
    console.log(msg);
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