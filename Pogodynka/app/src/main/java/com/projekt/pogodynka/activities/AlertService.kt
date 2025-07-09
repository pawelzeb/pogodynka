package com.projekt.pogodynka.activities

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.projekt.pogodynka.R
import com.projekt.pogodynka.db.FirebaseHelper
import java.util.Random

class AlertService : Service() {

    override fun onCreate() {
        super.onCreate()
        startForeground(NOTIFICATION_ID, createNotification())

        // Tu rejestrujemy listenera Firebase
        FirebaseHelper.setAlertRCBListener(applicationContext, ::notifyRCB)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun createNotification(): Notification {
        val channelId = "alert_channel_id"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Alert Notifications",
                NotificationManager.IMPORTANCE_LOW
            )
            getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
        }

        return NotificationCompat.Builder(this, channelId)
            .setContentTitle("Alert Service")
            .setContentText("Nasłuchiwanie alertów z Firebase")
            .setSmallIcon(R.drawable.sun) // Upewnij się, że ikona istnieje
            .build()
    }

    private fun notifyRCB(msg:String) {
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        val channelId = "rcb_notification_channel"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "RCB Alerts",
                NotificationManager.IMPORTANCE_HIGH
            )
            notificationManager.createNotificationChannel(channel)
        }

        val notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("🚨 Alert RCB")
//            .setContentText("Otrzymano nowy komunikat!")
            .setContentText(msg)
            .setSmallIcon(R.drawable.sun) // Zamień na swoją ikonę
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()

        notificationManager.notify(Random().nextInt(), notification)
    }

    companion object {
        const val NOTIFICATION_ID = 1
    }
}
