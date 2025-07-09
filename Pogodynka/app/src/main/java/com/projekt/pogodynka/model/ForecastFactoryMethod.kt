package com.projekt.pogodynka.model

import org.json.simple.JSONArray
import org.json.simple.JSONObject
import org.json.simple.parser.JSONParser
import java.io.BufferedReader
import java.io.IOException
import java.io.InputStream
import java.io.InputStreamReader
import java.io.Reader
import java.net.URL
import java.nio.charset.Charset
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

object ForecastFactoryMethod {


    fun getForecastData(city:String="Warszawa", cc:String="pl"):Map<String, List<WeatherData>>
    {
        val url =
            "https://api.openweathermap.org/data/2.5/forecast?q=${city},${cc}&appid=1f7cff01e11e11b2533f9497da9ee055"
        val  json = readJsonFromUrl(url)
        if(json == null)
            return mapOf()
        val weatherList = getForecast(json)
        // Format daty tylko do roku, miesiąca i dnia

        val dateFormatter = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())

        val groupedByDay: Map<String, List<WeatherData>> = weatherList.groupBy {
            dateFormatter.format(it.dt) // np. "2025-07-02"
        }

        return groupedByDay
    }

    private fun getForecast(json: JSONObject?): List<WeatherData> {

        if(json == null)
            return listOf()

        val parser = JSONParser()
        val array = parser.parse(json["list"].toString()) as JSONArray
        val list = mutableListOf<WeatherData>()
        for(period in array) {
            val w = WeatherData(period as JSONObject)
            println(w.temp)
            if(w.dt.isNotTodayAndBetween6and21())
                list.add(w)
            else
                println()
        }
        println(json)
        return list
    }
    fun Date.isNotTodayAndBetween6and21(): Boolean {
        val now = Calendar.getInstance()
        val target = Calendar.getInstance().apply { time = this@isNotTodayAndBetween6and21 }

        // Warunek 1: czy data nie jest dzisiejsza?
        val isSameDay = now.get(Calendar.YEAR) == target.get(Calendar.YEAR)
                && now.get(Calendar.DAY_OF_YEAR) == target.get(Calendar.DAY_OF_YEAR)
        if (isSameDay) return false

        // Warunek 2: godzina między 6:00 a 21:00 (włącznie)
        val hour = target.get(Calendar.HOUR_OF_DAY)
        return hour in 6..21
    }

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
        var iStream: InputStream? = null
        try {
            iStream = URL(url).openStream()
            val rd = BufferedReader(InputStreamReader(iStream, Charset.forName("UTF-8")))
            val jsonText = readAll(rd)
            println(jsonText)
            val parser = JSONParser()
            val json = parser.parse(jsonText) as JSONObject
            return json
        } catch (e: Exception) {
            return null
        } finally {
            iStream?.close()
        }
    }

}