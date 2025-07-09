package com.projekt.pogodynka.model

import android.content.Context
import android.widget.Toast
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

object ForecastPlaceholder {
    /**
     * An array of sample (placeholder) items.
     */
    val ITEMS: MutableList<ForecastData> = mutableListOf()

    /**
     * A map of sample (placeholder) items, by ID.
     */
    val ITEM_MAP: MutableMap<Int, ForecastData> = HashMap()

    init {
//        var date = Date()
//        for(i in 0 until 7) {
//            addData(ForecastData(Date(date.time + (i*(24 * 60 * 60 * 1000))) , arrayListOf<WeatherData>()))
//        }
    }

    fun init( city: String, cc: String) {
        synchronized(this) {
            ITEMS.clear()
            ITEM_MAP.clear()
                CoroutineScope(Dispatchers.IO).launch {
                    val map = ForecastFactoryMethod.getForecastData(city, cc)
                    if(map != null)
                    for(m in map) {
                        addData(ForecastData(m.value[0].dt, m.value))
                    }
            }
        }
    }

    fun addData(item: ForecastData) {
        synchronized(this) {
            if (!ITEM_MAP.containsKey(item.hashCode())) {
                ITEMS.add(item)
                ITEM_MAP[item.hashCode()] = item
            }
        }
    }
}