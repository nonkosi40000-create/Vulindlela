package com.example.vulindlela

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import com.example.vulindlela.network.SessionManager

class SplashActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_splash)

        val sessionManager = SessionManager(this)

        Handler(Looper.getMainLooper()).postDelayed({
            if (sessionManager.fetchAuthToken() != null) {
                // User is already logged in
                startActivity(Intent(this, DashboardActivity::class.java))
            } else {
                // Start onboarding/login flow
                startActivity(Intent(this, LanguagePickerActivity::class.java))
            }
            finish()
        }, 2000)
    }
}
