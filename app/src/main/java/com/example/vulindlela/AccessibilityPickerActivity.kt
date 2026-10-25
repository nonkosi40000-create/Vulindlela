package com.example.vulindlela

import android.content.Intent
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.view.View
import android.widget.Button
import android.widget.ImageButton
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.card.MaterialCardView
import java.util.Locale

class AccessibilityPickerActivity : AppCompatActivity(), TextToSpeech.OnInitListener {

    private lateinit var tts: TextToSpeech
    private var selectedMode: AppMode = AppMode.STANDARD

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        AccessibilityManager.init(this)
        enableEdgeToEdge()
        setContentView(R.layout.activity_accessibility_picker)

        tts = TextToSpeech(this, this)

        val cardStandard = findViewById<MaterialCardView>(R.id.card_mode_standard)
        val cardBlind = findViewById<MaterialCardView>(R.id.card_mode_blind)
        val cardLowVision = findViewById<MaterialCardView>(R.id.card_mode_low_vision)
        val cardMotor = findViewById<MaterialCardView>(R.id.card_mode_motor)

        val cards = listOf(cardStandard, cardBlind, cardLowVision, cardMotor)

        fun selectMode(mode: AppMode, selectedCard: MaterialCardView) {
            selectedMode = mode
            cards.forEach { 
                it.strokeWidth = if (it == selectedCard) 4 else 0
                it.setCardBackgroundColor(getColor(if (it == selectedCard) R.color.slate_900 else R.color.slate_800))
            }
            
            if (mode == AppMode.BLIND) {
                tts.speak("Voice-first mode selected. I will read everything on the screen for you.", TextToSpeech.QUEUE_FLUSH, null, null)
            }
        }

        cardStandard.setOnClickListener { selectMode(AppMode.STANDARD, cardStandard) }
        cardBlind.setOnClickListener { selectMode(AppMode.BLIND, cardBlind) }
        cardLowVision.setOnClickListener { selectMode(AppMode.LOW_VISION, cardLowVision) }
        cardMotor.setOnClickListener { selectMode(AppMode.MOTOR, cardMotor) }

        findViewById<Button>(R.id.btn_acc_continue).setOnClickListener {
            AccessibilityManager.currentMode = selectedMode
            startActivity(Intent(this, DashboardActivity::class.java))
            finish()
        }

        findViewById<View>(R.id.btn_back).setOnClickListener {
            onBackPressedDispatcher.onBackPressed()
        }

        findViewById<View>(R.id.btn_explain).setOnClickListener {
            showExplainSheet("access_picker")
        }
        
        findViewById<View>(R.id.btn_listen).setOnClickListener {
            tts.speak("Personalize your experience. Choose how you want to use the app.", TextToSpeech.QUEUE_FLUSH, null, null)
        }
    }

    private fun showExplainSheet(key: String) {
        val explanation = VulaExplainService.getExplanation(key)
        val dialog = BottomSheetDialog(this)
        val view = layoutInflater.inflate(R.layout.layout_explain_sheet, null)
        
        view.findViewById<TextView>(R.id.tv_vula_title).text = explanation.title
        view.findViewById<TextView>(R.id.tv_summary).text = explanation.summary
        view.findViewById<TextView>(R.id.tv_steps).text = explanation.steps.joinToString("\n") { "• $it" }
        view.findViewById<Button>(R.id.btn_next_action).text = explanation.nextAction

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
