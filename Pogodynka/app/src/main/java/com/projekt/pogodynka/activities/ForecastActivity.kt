package com.projekt.pogodynka.activities

import android.content.Intent
import android.os.Bundle
import android.preference.PreferenceManager.getDefaultSharedPreferences
import android.util.Log
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.projekt.pogodynka.R
import com.projekt.pogodynka.adapters.ForecastAdapter
import com.projekt.pogodynka.databinding.ActivityForecastBinding
import com.projekt.pogodynka.databinding.ActivityMainBinding
import com.projekt.pogodynka.model.ForecastPlaceholder

class ForecastActivity : AppCompatActivity() {
    private lateinit var rv: RecyclerView
    lateinit var binding: ActivityForecastBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
//        enableEdgeToEdge()
        binding = ActivityForecastBinding.inflate(layoutInflater)
        setContentView(binding.root)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
        rv = binding.favList
        rv.layoutManager = LinearLayoutManager(applicationContext)
        rv.adapter = ForecastAdapter(ForecastPlaceholder.ITEMS,resources, this)
        val sharedPreferences = getDefaultSharedPreferences(applicationContext)
        val city:String = sharedPreferences.getString("city", "Warszawa")?:"Warszawa"
        binding.cityName.setText(city)

        rv.setHasFixedSize(true)
        menuState(binding)
    }

    private fun menuState(binding: ActivityForecastBinding) {
        binding.bottomNavigation.selectedItemId = R.id.forecast
        binding.bottomNavigation.setOnItemSelectedListener {
            val intent = when (it.itemId) {
                R.id.weather -> Intent(applicationContext, WeatherActivity::class.java)
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
        binding.bottomNavigation.selectedItemId = R.id.forecast
        rv.adapter?.let {
            Log.d("TAG", "OnResume Notify")
            it.notifyDataSetChanged()
        }
    }
}