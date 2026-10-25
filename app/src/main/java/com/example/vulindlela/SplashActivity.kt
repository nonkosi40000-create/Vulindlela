package com.example.vulindlela

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity

class SplashActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_splash)

        // Bypassing login for the demo to show the "Me" tab
        Handler(Looper.getMainLooper()).postDelayed({
            startActivity(Intent(this, DashboardActivity::class.java))
            finish()
        }, 1500)
    }
}
