package com.example.vulindlela

import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.view.View
import android.widget.ImageButton
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.fragment.app.Fragment
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.bottomsheet.BottomSheetDialog
import java.util.Locale

class DashboardActivity : AppCompatActivity(), TextToSpeech.OnInitListener {

    private lateinit var tts: TextToSpeech
    private lateinit var screenTitle: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        AccessibilityManager.init(this)
        enableEdgeToEdge()
        setContentView(R.layout.activity_dashboard)

        val mainView = findViewById<View>(R.id.main)
        ViewCompat.setOnApplyWindowInsetsListener(mainView) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, 0)
            insets
        }

        screenTitle = findViewById(R.id.screen_title)
        tts = TextToSpeech(this, this)

        val navView: BottomNavigationView = findViewById(R.id.bottom_nav)

        navView.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> replaceFragment(HomeFragment(), "Home", "dash_home")
                R.id.nav_opps -> replaceFragment(OpportunitiesFragment(), "Opportunities", "dash_opps")
                R.id.nav_vula -> {
                    startActivity(android.content.Intent(this, VulaGuideActivity::class.java))
                    false
                }
                R.id.nav_shield -> replaceFragment(ShieldFragment(), "Shield", "dash_shield")
                R.id.nav_me -> replaceFragment(ProfileFragment(), "Me", "profile_me")
                else -> false
            }
        }

        // Default fragment
        if (savedInstanceState == null) {
            replaceFragment(HomeFragment(), "Home", "dash_home")
        }

        findViewById<View>(R.id.btn_explain).setOnClickListener {
            val currentKey = when(screenTitle.text) {
                "Home" -> "dash_home"
                "Opportunities" -> "dash_opps"
                "Shield" -> "dash_shield"
                "Me" -> "profile_me"
                else -> "dashboard_general"
            }
            showExplainSheet(currentKey)
        }

        findViewById<View>(R.id.btn_listen).setOnClickListener {
            tts.speak("You are on the ${screenTitle.text} page.", TextToSpeech.QUEUE_FLUSH, null, null)
        }

        findViewById<View>(R.id.fab_vula).setOnClickListener {
            startActivity(android.content.Intent(this, VulaGuideActivity::class.java))
        }
    }

    private fun replaceFragment(fragment: Fragment, title: String, key: String): Boolean {
        screenTitle.text = title
        screenTitle.announceForAccessibility(title)
        
        supportFragmentManager.beginTransaction()
            .replace(R.id.content_frame, fragment)
            .commit()
            
        return true
    }

    private fun showExplainSheet(key: String) {
        val explanation = VulaExplainService.getExplanation(key)
        val dialog = BottomSheetDialog(this)
        val view = layoutInflater.inflate(R.layout.layout_explain_sheet, null)
        
        view.findViewById<TextView>(R.id.tv_vula_title).text = explanation.title
        view.findViewById<TextView>(R.id.tv_summary).text = explanation.summary
        view.findViewById<TextView>(R.id.tv_steps).text = explanation.steps.joinToString("\n") { "• $it" }
        view.findViewById<android.widget.Button>(R.id.btn_next_action).text = explanation.nextAction

        view.findViewById<ImageButton>(R.id.btn_listen_sheet).setOnClickListener {
            tts.speak("${explanation.title}. ${explanation.summary}", TextToSpeech.QUEUE_FLUSH, null, null)
        }

        dialog.setContentView(view)
        dialog.show()
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts.language = Locale.getDefault()
        }
    }

    override fun onDestroy() {
        if (::tts.isInitialized) {
            tts.stop()
            tts.shutdown()
        }
        super.onDestroy()
    }
}
