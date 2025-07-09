package com.projekt.pogodynka.model

import android.annotation.SuppressLint
import android.util.Log
import com.projekt.pogodynka.Globalne
import org.json.simple.JSONArray
import org.json.simple.JSONObject
import org.json.simple.parser.JSONParser
import org.json.simple.parser.ParseException
import java.io.BufferedReader
import java.io.IOException
import java.io.InputStreamReader
import java.io.Reader
import java.net.URL
import java.nio.charset.Charset
import java.text.DateFormat
import java.text.SimpleDateFormat
import java.util.Date

class WeatherData {
    val lon: Float
    val lat: Float
    val icon: String
    val mainWeather: String
    val description: String
    val temp: Float
    val temp_min: Float
    val temp_max: Float
    val humidity: Int
    val pressure: Int
    val cloudCover: Int
    val windSpeed: Float
    val windDeg: Int
    val sunRise: Date
    val sunSet: Date
    val dt: Date    //czas odczytu
    val name: String //city
    val timeZoneOffset:Int


    constructor(  lon: Float,
                  lat: Float,
                  icon: String,
                  mainWeather: String,
                  description: String,
                  temp: Float,
                  temp_min: Float,
                  temp_max: Float,
                  humidity: Int,
                  pressure: Int,
                  cloudCover: Int,
                  windSpeed: Float,
                  windDeg: Int,
                  sunRise: Date,
                  sunSet: Date,
                  dt: Date,    //czas odczytu
                  name: String, //city
                  timeZoneOffset:Int
    ) {
        this.lon = lon
        this.lat = lat
        this.icon = icon
        this.mainWeather = mainWeather
        this.description = description
        this.temp = temp
        this.temp_max = temp_max
        this.temp_min = temp_min
        this.humidity = humidity
        this.pressure = pressure
        this.cloudCover = cloudCover
        this.windSpeed = windSpeed
        this.windDeg = windDeg
        this.sunRise = sunRise
        this.sunSet = sunSet
        this.dt = dt
        this.name = name
        this.timeZoneOffset = timeZoneOffset
    }
    constructor(w:WeatherData): this (w.lon, w.lat, w.icon, w.mainWeather, w.description, w.temp, w.temp_max, w.temp_min, w.humidity, w.pressure, w.cloudCover, w.windSpeed, w.windDeg, w.sunRise, w.sunSet, w.dt, w.name,w.timeZoneOffset)

    @SuppressLint("SimpleDateFormat")
    constructor(url: String): this(readJsonFromUrl(url))

    fun getSunRiseTime():String {
        val df: DateFormat = SimpleDateFormat("HH:mm:ss")
        return df.format(sunRise)
    }
    fun getSunSetTime():String {
        val df: DateFormat = SimpleDateFormat("HH:mm:ss")
        return df.format(sunSet)
    }
    fun getTime():String {
        val df: DateFormat = SimpleDateFormat("HH:mm:ss")
        return df.format(dt)
    }
    fun getSunRiseDate():String {
        val df: DateFormat = SimpleDateFormat("dd/MM/yyyy HH:mm:ss")
        return df.format(sunRise)
    }
    fun getSunSetDate():String {
        val df: DateFormat = SimpleDateFormat("dd/MM/yyyy HH:mm:ss")
        return df.format(sunSet)
    }
    fun getDate():String {
        val df: DateFormat = SimpleDateFormat("dd/MM/yyyy HH:mm:ss")
        return df.format(dt)
    }

    constructor(json:JSONObject?) {
        if(json == null) {
            this.lon = 0f
            this.lat = 0f
            this.icon = ""
            this.mainWeather = ""
            this.description = ""
            this.temp = 0f
            this.temp_max = 0f
            this.temp_min = 0f
            this.humidity = 0
            this.pressure = 0
            this.cloudCover = 0
            this.windSpeed = 0f
            this.windDeg = 0
            this.sunRise = Date()
            this.sunSet = Date()
            this.dt = Date()
            this.name = ""
            this.timeZoneOffset = 0
            return
        }
        val parser = JSONParser()
        val array = parser.parse(json["weather"].toString()) as JSONArray
        val windJson = parser.parse(json["wind"].toString()) as JSONObject
        windDeg = windJson["deg"].toString().toInt()
        windSpeed = windJson["speed"].toString().toFloat()
        val cloudJson = parser.parse(json["clouds"].toString()) as JSONObject
        if(json.containsKey("coord")) {
            val coordJson = parser.parse(json["coord"].toString()) as JSONObject
            lon = coordJson["lon"].toString().toFloat()
            lat = coordJson["lat"].toString().toFloat()
        }
        else {  //nie ma w forecast
            lon = 0f
            lat = 0f
        }
        cloudCover = cloudJson["all"].toString().toInt()
        println(array[0])
        val weatherJson = parser.parse(array[0].toString()) as JSONObject
        mainWeather = weatherJson["main"].toString()
        icon = weatherJson["icon"].toString()
        description = weatherJson["description"].toString()
        println(weatherJson["main"].toString())
        val mainJson = parser.parse(json["main"].toString()) as JSONObject
        temp = (Globalne.KelvinZero) + mainJson["temp"].toString().toFloat()
        temp_min = (Globalne.KelvinZero) + mainJson["temp_min"].toString().toFloat()
        temp_max = (Globalne.KelvinZero) + mainJson["temp_max"].toString().toFloat()
        humidity = mainJson["humidity"].toString().toInt()
        pressure = mainJson["pressure"].toString().toInt()
        name = json["name"].toString()
        if(json.containsKey("timezone"))
            timeZoneOffset = json["timezone"].toString().toInt() - 7200
        else
            timeZoneOffset = 0
        dt = Date((json["dt"].toString().toLong() + timeZoneOffset) * 1000)

        val sysJson = parser.parse(json["sys"].toString()) as JSONObject
        sunSet = if(sysJson.containsKey("sunset")) Date((sysJson["sunset"].toString().toLong() + timeZoneOffset) * 1000) else Date()
        sunRise = if(sysJson.containsKey("sunrise"))  Date((sysJson["sunrise"].toString().toLong() + timeZoneOffset) * 1000) else Date()
    }



    companion object {
        @Throws(IOException::class)
        private fun readAll(rd: Reader): String {
            val sb = StringBuilder()
            var cp: Int
            while ((rd.read().also { cp = it }) != -1) {
                sb.append(cp.toChar())
            }
            return sb.toString()
        }

        @Throws(IOException::class, java.text.ParseException::class)
        private fun readJsonFromUrl(url: String?): JSONObject? {
            val `is` = URL(url).openStream()
            try {
                val rd = BufferedReader(InputStreamReader(`is`, Charset.forName("UTF-8")))
                val jsonText = readAll(rd)
                val parser = JSONParser()
                val json = parser.parse(jsonText) as JSONObject
                return json
            } catch (e: ParseException) {
                Log.e("TAG", "${e.message}")
                return null
            } finally {
                `is`.close()
            }
        }
    }
}