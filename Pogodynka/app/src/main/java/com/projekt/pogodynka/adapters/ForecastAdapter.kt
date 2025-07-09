package com.projekt.pogodynka.adapters

import android.content.Context
import android.content.res.Resources
import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.projekt.pogodynka.databinding.ForecastLayoutBinding
import com.projekt.pogodynka.model.ForecastData
import com.squareup.picasso.Callback
import com.squareup.picasso.OkHttp3Downloader
import com.squareup.picasso.Picasso
import okhttp3.OkHttpClient
import java.util.concurrent.TimeUnit
import kotlin.math.min

class ForecastAdapter(val items: MutableList<ForecastData>,val resources: Resources?,val context: Context) : RecyclerView.Adapter<ForecastAdapter.ForecastViewHolder>()
{
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ForecastViewHolder {
        val binding = ForecastLayoutBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )


        return ForecastViewHolder(binding)
//            val view = LayoutInflater.from(parent.context).inflate(R.layout.game_layout_content, parent)
//            return GameViewHolder(view)
    }

    override fun getItemCount() = items.size

    override fun onBindViewHolder(holder: ForecastViewHolder, position: Int) {
        val w = items[position]
        //holder..text = "$gameName ${position + 1}"
        holder.weekDay.text = w.getDayOfWeek()
        val okHttpClient = OkHttpClient.Builder()
            .connectTimeout(10, TimeUnit.SECONDS) // Czas oczekiwania na połączenie
            .readTimeout(60, TimeUnit.SECONDS) // Czas oczekiwania na odpowiedź
            .writeTimeout(60, TimeUnit.SECONDS) // Czas oczekiwania na zapis
            .build()

        val indices = min(w.list.size, holder.temp.size)

        for(i in 0 until indices) {
            holder.temp[i].text = "${w.list[i].temp.toInt()}°C"

            val url = "https://openweathermap.org/img/w/${w.list[i].icon}.png"
            val picasso = Picasso.Builder(context)
                .downloader(OkHttp3Downloader(okHttpClient))
                .build()

            picasso.load(url)
                .into(holder.weatherImage[i], object : Callback {
                    override fun onSuccess() {
                        Log.d("TAG", "Wczytał plik graficzny")
                    }
                    override fun onError(e: Exception?) {
                        Log.e("TAG", "Nie wczytał pliku graficznego ${e?.message}")
                    }
                })
        }
    }
    inner class ForecastViewHolder(binding: ForecastLayoutBinding) :
        RecyclerView.ViewHolder(binding.root) {
        val weekDay: TextView = binding.weekDay
        val temp: List<TextView> = listOf( binding.h8Temp, binding.h11Temp,binding.h14Temp,binding.h17Temp,binding.h20Temp)
        val weatherImage: List<ImageView> = listOf( binding.h8, binding.h11,binding.h14,binding.h17,binding.h20)


    }
}
