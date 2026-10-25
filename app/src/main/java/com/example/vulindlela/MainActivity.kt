package com.example.vulindlela

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

/**
 * VULINDLELA NAVIGATOR
 * This activity acts as a portal to all the native screens in the app.
 * Use this to preview and test the UI "Activities" directly.
 */
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Setup navigation buttons
        setupButton(R.id.btn_to_splash, SplashActivity::class.java)
        setupButton(R.id.btn_to_lang, LanguagePickerActivity::class.java)
        setupButton(R.id.btn_to_popia, PopiaActivity::class.java)
        setupButton(R.id.btn_to_login, LoginActivity::class.java)
        setupButton(R.id.btn_to_access, AccessibilityPickerActivity::class.java)
        setupButton(R.id.btn_to_dash, DashboardActivity::class.java)
        setupButton(R.id.btn_to_profile, ProfileActivity::class.java)
        setupButton(R.id.btn_to_scam, ScamCheckerActivity::class.java)
        setupButton(R.id.btn_to_guide, VulaGuideActivity::class.java)
        
        // Employer Portal doesn't have an activity yet, let's create it if needed
        // setupButton(R.id.btn_to_employer, EmployerPortalActivity::class.java)
    }

    private fun <T> setupButton(buttonId: Int, activityClass: Class<T>) {
        findViewById<Button>(buttonId)?.setOnClickListener {
            startActivity(Intent(this, activityClass))
        }
    }
}
