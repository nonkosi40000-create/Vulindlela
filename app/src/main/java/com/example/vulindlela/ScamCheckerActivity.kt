package com.example.vulindlela

import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.view.View
import android.widget.Button
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import com.example.vulindlela.databinding.ActivityScamCheckerBinding
import com.example.vulindlela.network.RetrofitClient
import com.example.vulindlela.network.ScamCheckRequest
import com.example.vulindlela.network.ReportScamRequest
import com.google.android.material.bottomsheet.BottomSheetDialog
import kotlinx.coroutines.launch
import java.util.Locale

class ScamCheckerActivity : AppCompatActivity(), TextToSpeech.OnInitListener {
    private lateinit var binding: ActivityScamCheckerBinding
    private var tts: TextToSpeech? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityScamCheckerBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tts = TextToSpeech(this, this)

        ViewCompat.setOnApplyWindowInsetsListener(binding.headerShield) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, 0)
            insets
        }

        binding.btnCheckScam.setOnClickListener {
            val input = binding.etScamInput.text.toString()
            if (input.isNotEmpty()) {
                performScamCheck(input)
            } else {
                Toast.makeText(this, "Please paste a message first", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun performScamCheck(text: String) {
        lifecycleScope.launch {
            try {
                binding.btnCheckScam.isEnabled = false
                binding.btnCheckScam.text = "ANALYZING..."
                
                val response = RetrofitClient.api.checkScam(ScamCheckRequest(text))
                
                binding.btnCheckScam.isEnabled = true
                binding.btnCheckScam.text = "CHECK FOR SCAMS"

                if (response.isSuccessful) {
                    response.body()?.let { showResultSheet(text, it.riskLevel, it.explanation, it.reasons) }
                } else {
                    Toast.makeText(this@ScamCheckerActivity, "Shield check failed.", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                binding.btnCheckScam.isEnabled = true
                binding.btnCheckScam.text = "CHECK FOR SCAMS"
                Toast.makeText(this@ScamCheckerActivity, "Connection error.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun showResultSheet(originalText: String, risk: String, explanation: String, reasons: List<String>) {
        val dialog = BottomSheetDialog(this)
        val view = layoutInflater.inflate(R.layout.view_scam_result, null)
        
        val tvRisk = view.findViewById<TextView>(R.id.tv_scam_level)
        val tvExpl = view.findViewById<TextView>(R.id.tv_scam_explanation)
        val tvReasons = view.findViewById<TextView>(R.id.tv_red_flags)
        val btnReport = view.findViewById<Button>(R.id.btn_scam_report)
        val btnDismiss = view.findViewById<Button>(R.id.btn_scam_dismiss)
        val btnListen = view.findViewById<ImageButton>(R.id.btn_listen_scam)
        
        tvRisk.text = "Risk Level: ${risk.uppercase()}"
        tvRisk.setTextColor(getColor(when(risk) {
            "Safe" -> R.color.brand_green
            "Warning" -> R.color.sunrise_gold
            else -> R.color.soft_coral
        }))
        
        tvExpl.text = explanation
        tvReasons.text = reasons.joinToString("\n") { "• $it" }

        btnListen.setOnClickListener {
            tts?.speak("$risk risk detected. $explanation", TextToSpeech.QUEUE_FLUSH, null, null)
        }

        btnReport.setOnClickListener {
            reportScam(originalText, risk, dialog)
        }

        btnDismiss.setOnClickListener { dialog.dismiss() }
        
        dialog.setContentView(view)
        dialog.show()
    }

    private fun reportScam(text: String, risk: String, dialog: BottomSheetDialog) {
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.api.reportScam(ReportScamRequest(text, "User reported $risk risk"))
                if (response.isSuccessful) {
                    Toast.makeText(this@ScamCheckerActivity, "Thank you. This listing has been flagged for review.", Toast.LENGTH_LONG).show()
                    dialog.dismiss()
                    binding.etScamInput.text.clear()
                } else {
                    Toast.makeText(this@ScamCheckerActivity, "Report failed. Please try again.", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@ScamCheckerActivity, "Connection error.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts?.language = Locale.getDefault()
        }
    }

    override fun onDestroy() {
        tts?.stop()
        tts?.shutdown()
        super.onDestroy()
    }
}
