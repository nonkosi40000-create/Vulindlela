package com.example.vulindlela

import android.content.Intent
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.view.View
import android.widget.Button
import android.widget.CheckBox
import android.widget.ImageButton
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.card.MaterialCardView
import java.util.Locale

class PopiaActivity : AppCompatActivity(), TextToSpeech.OnInitListener {

    private lateinit var tts: TextToSpeech

    private var section1Read = false
    private var section2Read = false
    private var section3Read = false

    private lateinit var progressBar: ProgressBar
    private lateinit var cbConsent: CheckBox
    private lateinit var btnAccept: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_popia)

        // Initialize TTS
        tts = TextToSpeech(this, this)

        progressBar = findViewById(R.id.progress_reading)
        cbConsent = findViewById(R.id.cb_consent)
        btnAccept = findViewById(R.id.btn_accept)

        setupCollapsibleCard(
            R.id.card_collect,
            R.id.text_collect_detail,
            R.id.btn_listen_1,
            1
        )
        setupCollapsibleCard(
            R.id.card_why,
            R.id.text_why_detail,
            R.id.btn_listen_2,
            2
        )
        setupCollapsibleCard(
            R.id.card_rights,
            R.id.text_rights_detail,
            R.id.btn_listen_3,
            3
        )

        cbConsent.setOnCheckedChangeListener { _, isChecked ->
            btnAccept.isEnabled = isChecked && isFullyRead()
        }

        btnAccept.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }

        findViewById<View>(R.id.btn_back).setOnClickListener {
            onBackPressedDispatcher.onBackPressed()
        }

        findViewById<View>(R.id.btn_explain).setOnClickListener {
            showExplainSheet()
        }
    }

    private fun setupCollapsibleCard(cardId: Int, detailId: Int, listenBtnId: Int, sectionIndex: Int) {
        val card = findViewById<MaterialCardView>(cardId)
        val detail = findViewById<TextView>(detailId)
        val listenBtn = findViewById<ImageButton>(listenBtnId)

        card.setOnClickListener {
            if (detail.visibility == View.GONE) {
                detail.visibility = View.VISIBLE
                markSectionRead(sectionIndex)
            } else {
                detail.visibility = View.GONE
            }
        }

        listenBtn.setOnClickListener {
            val text = detail.text.toString()
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, null)
            markSectionRead(sectionIndex)
            // If it was hidden, show it when listening
            detail.visibility = View.VISIBLE
        }
    }

    private fun markSectionRead(index: Int) {
        when (index) {
            1 -> section1Read = true
            2 -> section2Read = true
            3 -> section3Read = true
        }
        updateProgress()
    }

    private fun updateProgress() {
        var count = 0
        if (section1Read) count++
        if (section2Read) count++
        if (section3Read) count++

        val progress = (count / 3f * 100).toInt()
        progressBar.progress = progress

        if (count == 3) {
            cbConsent.isEnabled = true
            findViewById<TextView>(R.id.text_progress_label).text = "Ready to accept"
        }
    }

    private fun isFullyRead(): Boolean = section1Read && section2Read && section3Read

    private fun showExplainSheet() {
        // Implementation for Section D: Universal "Explain this" button
        Toast.makeText(this, "Vula: This page asks for your permission to use your data safely.", Toast.LENGTH_LONG).show()
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
