package com.projekt.pogodynka.activities

import android.content.Intent
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.projekt.pogodynka.R
import com.projekt.pogodynka.databinding.ActivityHistoryBinding
import com.projekt.pogodynka.databinding.ActivityMainBinding

class HistoryActivity : AppCompatActivity() {
    lateinit var binding: ActivityHistoryBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHistoryBinding.inflate(layoutInflater)
//        enableEdgeToEdge()
        setContentView(binding.root)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
        menuState(binding)
    }

    private fun menuState(binding: ActivityHistoryBinding) {
        binding.bottomNavigation.selectedItemId = R.id.history
        binding.bottomNavigation.setOnItemSelectedListener {
            val intent = when (it.itemId) {
                R.id.weather -> Intent(applicationContext, WeatherActivity::class.java)
                R.id.forecast -> Intent(applicationContext, ForecastActivity::class.java)
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
        binding.bottomNavigation.selectedItemId = R.id.history
    }
}