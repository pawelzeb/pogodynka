const mysql = require('mysql2/promise');

class Database {
  constructor() {
	console.log("Inicjuje połaczenie...")
    this.pool = mysql.createPool({
     	// host: 'mariadb',
     	host: 'localhost',
        user: 'pogodynka_user',
        password: 'pogodynka_passw321!',
        database: 'pogodynka',
      	waitForConnections: true,
      	connectionLimit: 10,
      	queueLimit: 0
    });
  }
  insertWeatherData(json, cc) {
	  (async () => {
		  try {
			  const city = json.name
			  let [rows] = await this.pool.execute(
				  'SELECT * FROM city WHERE name LIKE ?',
				  [city]
				);
				
				if(rows.length <= 0) {
					console.log(rows[0])
					//dodaj miasto
					await this.pool.execute(
						'INSERT INTO city (lon, lat, name, timezone_offset, follow, cc) VALUES (?, ?, ?, ?, ?, ?)',
		  				[json.coord.lon, json.coord.lat, city, json.timezone, 0, cc]					
					);
					console.log(`Dodano nowe miasto ${city}`);
					[rows] = await this.pool.execute(
						'SELECT id FROM city WHERE name LIKE ?',
						[city]
					);
				}
				const city_id = rows[0].id
				
				await this.pool.execute(
					'INSERT INTO weather_data (city_id, dt, icon, main_weather, description, temp, temp_min, temp_max, humidity, pressure, cloud_cover, wind_speed, wind_deg, sun_rise, sun_set) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
					[city_id, json.dt, json.weather[0].icon, json.weather[0].main, json.weather[0].description, json.main.temp, json.main.temp_min, json.main.temp_max, json.main.humidity, json.main.pressure, -1, json.wind.speed, json.wind.deg, json.sys.sunrise, json.sys.sunset]
				);
				console.log('Wstawiono dane');
			} catch (err) {
				console.error('Błąd przy wstawianiu:', err.message);
			}
		})();
	}
	//;
    insertFollow(json,cc, iFollow) {
		(async () => {
			try {
				const city = json.name
		const [rows] = await this.pool.execute(
			'SELECT * FROM city WHERE name LIKE ?',
			[city]
			);
			
		if(rows.length <= 0) {
			//dodaj miasto 
			await this.pool.execute(
			  'INSERT INTO city (lon, lat, name, timezone_offset, follow, cc) VALUES (?, ?, ?, ?, ?, ?)',
			  [json.coord.lon, json.coord.lat, city, json.timezone, iFollow>0, cc]
			);
			console.log(`Dodano nowe miasto ${city} ${cc}`);
		}
		else {
			const city_id = rows[0].id
			//console.log(`to tu ${rows[0].id}`)
			await this.pool.execute(
				'UPDATE city SET follow = follow + ? WHERE id=?',
				[iFollow, rows[0].id]
			);
			
		}

		if(iFollow > 0)
			console.log(`Is following ${city} now`);
		else
			console.log(`Is unfollowing ${city} now`);

      } catch (err) {
        console.error('Błąd przy wstawianiu:', err.message);
      }
    })();
  }

  	async getFollow() {
		console.log("get follow");
		try {
			const [rows] = await this.pool.execute('SELECT * FROM city WHERE follow > 0');
			return rows
		} catch (err) {
			console.error('Błąd przy czytaniu follow:', err.message);
			return null;
		}
	}

	async getForecastCityData(city, cc) {
		const [rows] = await this.pool.execute(
			'SELECT wd.* FROM weather_data wd, city c WHERE c.name LIKE ? AND c.cc = ? AND c.id = wd.city_id',
			[city, cc]
			);
		// console.log("Wraca " + rows.length)	
		return rows
	}
}

module.exports = Database ;
