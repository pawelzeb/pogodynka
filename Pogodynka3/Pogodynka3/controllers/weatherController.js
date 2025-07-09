
const axios = require('axios')
const Database = require('../db/Database')

const version = '0.9.0'
const name = 'Pogodynka API'

const key = '1f7cff01e11e11b2533f9497da9ee055'

const getWeather = async (req, res) => {
    const city = req.params.city;
    const cc = req.params.cc; //kod kraju
    console.log(`Zapytanie o ${city} z ${cc}`)
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},${cc}&appid=${key}`)
        console.log(response.data.name);
        res.json(response.data);
        }
    catch {
        res.json({code: 404, error: `Nie znaleziono lokacji ${city} w ${cc}`});
    }
}

const getMain  = async (req, res) => {
    
    res.json({code: 200, name: name, version: version});
}

const  getForecast = async (req, res) => {
    const city = req.params.city;
    const cc = req.params.cc; //kod kraju
    console.log(`Zapytanie o ${city} z ${cc}`)
    // res.json({Miasto: city, cc: cc});
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city},${cc}&appid=${key}`)
        console.log(response.data.name);
        res.json(response.data);
    }
    catch {
        res.json({code: 404, error: `Nie znaleziono lokacji ${city} w ${cc}`});
    }
}



const setFollowCity = async (req, res) => {
    const city = req.params.city;
    const cc = req.params.cc; //kod kraju
    console.log(`follow ${city} z ${cc}`)
        try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},${cc}&appid=${key}`)
        const db = new Database();
        db.insertFollow(response.data, 1)
        res.send({code:200})
    }
    catch {
        res.json({code: 404, error: `Nie znaleziono lokacji ${city} w ${cc}`});
    }

}

const removeFollowCity = async (req, res) => {
    const city = req.params.city;
    const cc = req.params.cc; //kod kraju
    console.log(`follow ${city} z ${cc}`)
        try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},${cc}&appid=${key}`)
        const db = new Database();
        db.insertFollow(response.data, -1)
        res.send({code:200})
    }
    catch {
        res.json({code: 404, error: `Nie znaleziono lokacji ${city} w ${cc}`});
    }
}


module.exports = { getWeather, getForecast, getMain, setFollowCity, removeFollowCity }