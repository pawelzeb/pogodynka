package com.projekt.pogodynka.model

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

data class ForecastData(val date: Date, val list:List<WeatherData>) {
    fun getDayOfWeek():String  {
        val sdf = SimpleDateFormat("EEEE", Locale.getDefault())
        return sdf.format(date)
    }
}
