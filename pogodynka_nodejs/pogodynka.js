const express = require('express');
const cors = require('cors');
const {getWeather, getForecast, getMain, setFollowCity, removeFollowCity} = require("./controllers/weatherController")
const {getHistory} = require("./controllers/dbController")
const {serverSettings1} = require("./actions/serverActions")
const app = express();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const version = '0.9.0'
const name = 'Pogodynka API'
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: name,
      version: version,
      description: 'Dokumentacja REST API serwera nodejs Pogodynka',
    },
  },
  apis: ['./pogodynka.js'], // pliki z komentarzami Swagger
};

const specs = swaggerJsDoc(options);

module.exports = { swaggerUi, specs };

const PORT = process.env.PORT || 3000;


// app.use(cors({
//     origin: 'http://localhost:3000',    //TODO: podmienić na adres Reacta
//     methods: ['GET', 'PUT', 'DELETE'],
//   credentials: true
// }));
//app.options('*', cors());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

//definicje routingu
app.use(express.json());
/**
 * @swagger
 * /main:
 *   get:
 *     summary: Wraca dane na temat serwera, wersję API, 
 *     responses:
 *       200:
 *          description: Sukces, zwrotny json z code 200, name i version
 *       404: 
 *          description: Nie znaleziono lokacji zwrotny json z code 404 i error zawierajacym komunikat werbalny o błędzie
 */
app.get('/', getMain);
/**
 * @swagger
 * /weather/{city}/{cc}:
 *   get:
 *     tags:
 *       - Weather API
 *     summary: Serwer Pogodynka wraca najbardziej aktualne dane pogodowe dla zadanego miasta (city) w kraju cc (dwuliterowy kod państwa, np "pl", "us").
 *     parameters:
 *       - name: city
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Nazwa miasta, np. "Warszawa", "London"
 *       - name: cc
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Dwuliterowy kod kraju zgodny z ISO 3166-1, np. "pl", "us", "de"
 *     responses:
 *       200:
 *         description: Sukces, wracany jest obiekt json z danymi pogodowymi
 *       404: 
 *         description: Nie znaleziono lokacji — zwrotny json z code 404 i polem "error" zawierającym komunikat werbalny o błędzie
 */

app.get('/weather/:city/:cc', getWeather);
/**
 * @swagger
 * /forecast/{city}/{cc}:
 *   get:
 *     tags:
 *       - Weather API
 *     summary: Serwer Pogodynka wraca prognozę na najbliższe dni dla zadanego miasta (city) w kraju cc (dwuliterowy kod państwa, np "pl", "us").
 *     parameters:
 *       - name: city
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Nazwa miasta, np. "Warszawa", "London"
 *       - name: cc
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Dwuliterowy kod kraju zgodny z ISO 3166-1, np. "pl", "us", "de"
 *     responses:
 *      200:
 *          description: Sukces, wracana jest tablica obiektów json z danymi pogodowymi (JSONArray)
 *      404: 
 *          description: Nie znaleziono lokacji zwrotny json z code 404 i error zawierajacym komunikat werbalny o błędzie
 */
app.get('/forecast/:city/:cc', getForecast);
/**
 * @swagger
 * /history/{city}/{cc}:
 *   get:
 *     tags:
 *       - Zapytania do MariaDB
 *     summary: Serwer Pogodynka wraca historyczne dane pogodowe dla zadanego miasta (city). Dane są agregowane na serwerze bazodanowym MariaDB i zbierane jedynie dla miast obserwowanych co 30 minut. 
 *     parameters:
 *       - name: city
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Nazwa miasta, np. "Warszawa", "London"
 *       - name: cc
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Dwuliterowy kod kraju zgodny z ISO 3166-1, np. "pl", "us", "de"
 *     responses:
 *      200:
 *          description: Sukces, wracana jest tablica obiektów json z danymi pogodowymi (JSONArray)
 *      404: 
 *          description: Nie znaleziono lokacji zwrotny json z code 404 i error zawierajacym komunikat werbalny o błędzie
 */
app.get('/history/:city/:cc', getHistory);
/**
 * @swagger
 * /follow/{city}/{cc}:
 *   put:
 *     tags:
 *       - Follow
 *     summary: Dodaj miasto do alertów. Serwer będzie analizował dane pogodowe dla miasta i wysyłał alerty na serwer Firebase.
 *     parameters:
 *       - name: city
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Nazwa miasta, np. "Warszawa", "London"
 *       - name: cc
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Dwuliterowy kod kraju zgodny z ISO 3166-1, np. "pl", "us", "de"
 *     responses:
 *      200:
 *          description: Sukces
 *      500: 
 *          description: Nie znaleziono żadnych danych code 500 i error zawierajacym komunikat werbalny o pustym zbiorze
 */
app.put('/follow/:city/:cc', setFollowCity);
/**
 * @swagger
 * /follow/{city}/{cc}:
 *   delete:
 *     tags:
 *       - Follow
 *     summary: Usuwa miasto z alertów. Jeśli żaden klient nie obserwuje miasta serwer Pogodynka przerywa wysyłanie alertów na serwer Firebase.
 *     parameters:
 *       - name: city
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Nazwa miasta, np. "Warszawa", "London"
 *       - name: cc
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Dwuliterowy kod kraju zgodny z ISO 3166-1, np. "pl", "us", "de"
 *     responses:
 *       200:
 *         description: Sukces
 *       404: 
 *         description: Nie znaleziono lokacji zwrotny json z code 404 i error zawierajacym komunikat werbalny o błędzie
 */
app.delete('/follow/:city/:cc', removeFollowCity);
//uruchomienie serwera + predefiniowany zestaw poleceń
app.listen(PORT, serverSettings1(PORT));
