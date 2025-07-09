package com.projekt.pogodynka

import com.projekt.pogodynka.model.ForecastData
import com.projekt.pogodynka.model.ForecastFactoryMethod
import com.projekt.pogodynka.model.ForecastPlaceholder
import com.projekt.pogodynka.model.WeatherData
import org.json.simple.parser.ParseException
import org.junit.Test

import org.junit.Assert.*
import java.io.IOException
import java.util.Calendar
import java.util.Date

/**
 * Example local unit test, which will execute on the development machine (host).
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
class ExampleUnitTest {
    @Test
    fun addition_isCorrect() {
        assertEquals(4, 2 + 2)
    }
    @Test
    fun forecastParserTest() {
        val map = ForecastFactoryMethod.getForecastData()
        for(m in map) {
            ForecastPlaceholder.addData(ForecastData(m.value[0].dt, m.value))
        }
    }
    @Test
    fun weatherAPIParserTest() {
        val city="Kraków"
        val cc = "pl"
        val pogoda: WeatherData? = try {
             WeatherData(
                "https://api.openweathermap.org/data/2.5/weather?q=$city,$cc&appid=1f7cff01e11e11b2533f9497da9ee055")
        } catch (e: IOException) {
            null
        } catch (e: ParseException) {
            null
        }
        pogoda?.let{
            with(pogoda) {
                println(description)
                println(temp)
                println(getTime())
                println(getSunRiseTime())
                println(getSunSetTime())
                println("==============")
                println(timeZoneOffset)
            }
        }
    }



}