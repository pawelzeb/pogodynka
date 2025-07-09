package com.projekt.pogodynka.activities

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.preference.PreferenceManager.getDefaultSharedPreferences
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.projekt.pogodynka.R
import com.projekt.pogodynka.databinding.ActivityMainBinding
import com.projekt.pogodynka.model.ForecastPlaceholder
import com.projekt.pogodynka.model.WeatherData
import com.squareup.picasso.Callback
import com.squareup.picasso.OkHttp3Downloader
import com.squareup.picasso.Picasso
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import java.math.BigDecimal
import java.math.RoundingMode
import java.util.concurrent.TimeUnit

class WeatherActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private fun getDataForLocation(context: Context, city: String, cc:String) {
        CoroutineScope(Dispatchers.IO).launch {
        val pogoda: WeatherData? = try {
            WeatherData(
                "https://api.openweathermap.org/data/2.5/weather?q=${city},${cc}&appid=1f7cff01e11e11b2533f9497da9ee055")
        } catch (e: Exception) {
            withContext(Dispatchers.Main) {
                Toast.makeText(context, "Nie rozpoznana nazwa lokacji", Toast.LENGTH_LONG ).show()
            }
            null
        }
        pogoda?.let{
            ForecastPlaceholder.init(city, cc)
            Log.d("TAG", "Zapisuje do sharedPreferences")
            val sharedPreferences = getDefaultSharedPreferences(applicationContext)
            val editor = sharedPreferences.edit()
            editor.putString("city", city)
            editor.putString("cc", cc)
            editor.apply()

            with(pogoda) {
                withContext(Dispatchers.Main) {
                    binding.mainLayout.visibility = View.VISIBLE
                    binding.description.text = description
                    binding.temp.text = "${round(temp,0)}°C"
                    binding.tempMax.text = "Max: ${round(temp_max,0)}°C"
                    binding.tempMin.text = "Min: ${round(temp_min,0)}°C"
                    binding.lat.text = "${round(lat)}°"
                    binding.lon.text = "${round(lon)}°"
                    binding.name.text = name
                    binding.name.text = name
                    binding.windSpeed.text = "${round(windSpeed)} m/s"
                    binding.pressure.text = "${pressure}mBar"
                    binding.sunRise.text = "${getSunRiseTime()}"
                    binding.sunSet.text = "${getSunSetTime()}"
                    binding.localTime.text = "(${getTime()})"
                    binding.windBearing.rotation = windDeg.toFloat()

                    val url = "https://openweathermap.org/img/w/${icon}.png"
                    val okHttpClient = OkHttpClient.Builder()
                        .connectTimeout(10, TimeUnit.SECONDS) // Czas oczekiwania na połączenie
                        .readTimeout(60, TimeUnit.SECONDS) // Czas oczekiwania na odpowiedź
                        .writeTimeout(60, TimeUnit.SECONDS) // Czas oczekiwania na zapis
                        .build()

                    val picasso = Picasso.Builder(applicationContext)
                        .downloader(OkHttp3Downloader(okHttpClient))
                        .build()

                    picasso.load(url)
                        .into(binding.weatherImage, object : Callback {
                            override fun onSuccess() {
                                Log.d("TAG", "Wczytał plik graficzny")
                            }
                            override fun onError(e: Exception?) {
                                Log.e("TAG", "Nie wczytał pliku graficznego ${e?.message}")
                            }
                        })
                    val dayLengthMillis = sunSet.time - sunRise.time
                    val dayLengthSeconds = dayLengthMillis / 1000 // Konwersja na sekundy
                    val dayLengthMinutes = dayLengthSeconds / 60 // Konwersja na minuty
                    val dayLengthHours = dayLengthMinutes / 60 // Konwersja na godziny
//                    val h = dayLengthHours
//                    val m =  (dayLengthSeconds - h * 3600)/60
//                    val s = (dayLengthSeconds - h * 3600 - m * 60)

                    println("Długość dnia: $dayLengthHours godzin i ${dayLengthMinutes % 60} minut")


                    if(dt.time < sunRise.time || dt.time > sunSet.time) {
                        binding.sunBearing.visibility = View.INVISIBLE
                        return@withContext
                    }
                    val now = dt.time - sunRise.time
                    binding.sunBearing.visibility = View.VISIBLE
                    val angle = -90f + now.toFloat()/dayLengthMillis.toFloat() * 180f
                    binding.sunBearing.rotation = angle
                }
            }
        }
    }

}
    fun round(number: Float, scale:Int = 2) = BigDecimal(number.toDouble()).setScale(scale, RoundingMode.HALF_UP).toFloat()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, 0)
            insets
        }

        val sharedPreferences = getDefaultSharedPreferences(applicationContext)
        val city:String = sharedPreferences.getString("city", "Warszawa")?:"Warszawa"
        val cc:String = sharedPreferences.getString("cc", "pl")?:"pl"
        binding.location.setText(city)
        binding.cc.setText(cc)

        binding.btnGo.setOnClickListener {
            var city = binding.location.text.toString().trim()
            var cc = binding.cc.text.toString().trim()
            if(city.isEmpty() || cc.isEmpty()) return@setOnClickListener
            getDataForLocation(applicationContext, city,cc)
        }
        menuState(binding)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU)
        {
            requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), 100)
        }
        else {
            startService()
        }
//        binding.bottomNavigation.selectedItemId = R.id.weather

    }

    private fun startService() {
        val intent = Intent(this, AlertService::class.java)
        ContextCompat.startForegroundService(this, intent)
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == 100 && grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            startService() // ← Twoja funkcja do startu serwisu
        } else {
            Toast.makeText(this, "Brak zgody na powiadomienia", Toast.LENGTH_SHORT).show()
        }
    }

    private fun menuState(binding: ActivityMainBinding) {
        binding.bottomNavigation.selectedItemId = R.id.weather
        binding.bottomNavigation.setOnItemSelectedListener {
            val intent = when (it.itemId) {
                R.id.forecast -> Intent(applicationContext, ForecastActivity::class.java)
                R.id.history -> Intent(applicationContext, HistoryActivity::class.java)
                else -> null
            }
            if (intent != null) {
                startActivity(intent)
                overridePendingTransition(0, 0)
            }
            true
        }
    }
    override fun onResume() {
        super.onResume()
        binding.btnGo.performClick()
    }
}