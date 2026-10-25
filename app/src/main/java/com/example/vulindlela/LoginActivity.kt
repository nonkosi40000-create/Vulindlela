package com.example.vulindlela

import android.content.Intent
import android.os.Bundle
import android.os.CountDownTimer
import android.speech.tts.TextToSpeech
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.vulindlela.network.OtpRequest
import com.example.vulindlela.network.RetrofitClient
import com.example.vulindlela.network.VerifyOtpRequest
import com.example.vulindlela.network.SessionManager
import com.google.android.material.bottomsheet.BottomSheetDialog
import kotlinx.coroutines.launch
import java.util.Locale

class LoginActivity : AppCompatActivity(), TextToSpeech.OnInitListener {

    private lateinit var tts: TextToSpeech
    private lateinit var layoutPhoneInput: LinearLayout
    private lateinit var layoutOtpInput: LinearLayout
    private lateinit var layoutNameInput: LinearLayout
    private lateinit var tvResendTimer: TextView
    private lateinit var etMobile: EditText
    private lateinit var etOtp: EditText
    private lateinit var etFullName: EditText
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_login)

        sessionManager = SessionManager(this)
        tts = TextToSpeech(this, this)

        layoutPhoneInput = findViewById(R.id.layout_phone_input)
        layoutOtpInput = findViewById(R.id.layout_otp_input)
        layoutNameInput = findViewById(R.id.layout_name_input)
        tvResendTimer = findViewById(R.id.tv_resend_timer)
        etMobile = findViewById(R.id.et_mobile)
        etOtp = findViewById(R.id.et_otp)
        etFullName = findViewById(R.id.et_full_name)

        // Navigation & Global Actions
        findViewById<View>(R.id.btn_back).setOnClickListener {
            when {
                layoutNameInput.visibility == View.VISIBLE -> showOtpSection()
                layoutOtpInput.visibility == View.VISIBLE -> showPhoneSection()
                else -> onBackPressedDispatcher.onBackPressed()
            }
        }

        findViewById<View>(R.id.btn_explain).setOnClickListener {
            showExplainSheet("login_page")
        }

        findViewById<View>(R.id.btn_listen).setOnClickListener {
            speakPageContent()
        }

        // Feature: Mobile -> OTP Flow
        findViewById<Button>(R.id.btn_get_otp).setOnClickListener {
            val mobile = etMobile.text.toString()
            if (mobile.length >= 10) {
                requestOtp(mobile)
            } else {
                Toast.makeText(this, "Please enter a valid mobile number", Toast.LENGTH_SHORT).show()
            }
        }

        findViewById<Button>(R.id.btn_verify_otp).setOnClickListener {
            val otp = etOtp.text.toString()
            if (otp.length == 6) {
                verifyOtp(etMobile.text.toString(), otp)
            } else {
                showError("That code is not right. Check the SMS and try again.")
            }
        }

        // Feature: Save Name & Complete Registration
        findViewById<Button>(R.id.btn_save_name).setOnClickListener {
            val name = etFullName.text.toString()
            if (name.isNotBlank()) {
                saveUserName(name)
            } else {
                Toast.makeText(this, "Please enter your full name", Toast.LENGTH_SHORT).show()
            }
        }

        findViewById<View>(R.id.tv_why_phone).setOnClickListener {
            showExplainSheet("why_phone")
        }
        findViewById<View>(R.id.tv_why_otp).setOnClickListener {
            showExplainSheet("why_otp")
        }

        findViewById<View>(R.id.fab_vula).setOnClickListener {
            showExplainSheet("quick_vula_help")
        }
    }

    private fun requestOtp(mobile: String) {
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.api.requestOtp(OtpRequest(mobile))
                if (response.isSuccessful) {
                    showOtpSection()
                    Toast.makeText(this@LoginActivity, "OTP sent successfully", Toast.LENGTH_SHORT).show()
                } else {
                    showError("Failed to send OTP. Please check your number.")
                }
            } catch (e: Exception) {
                showError("Connection error. Make sure your data is on.")
            }
        }
    }

    private fun verifyOtp(mobile: String, otp: String) {
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.api.verifyOtp(VerifyOtpRequest(mobile, otp))
                if (response.isSuccessful) {
                    val loginResponse = response.body()
                    loginResponse?.let {
                        sessionManager.saveAuthToken(it.accessToken)
                        if (!it.user.isProfileComplete) {
                            showNameSection()
                        } else {
                            startActivity(Intent(this@LoginActivity, AccessibilityPickerActivity::class.java))
                            finish()
                        }
                    }
                } else {
                    showError("Invalid code. Check the SMS and try again.")
                }
            } catch (e: Exception) {
                showError("Connection error. Please try again.")
            }
        }
    }

    private fun saveUserName(name: String) {
        // In a real app, you would call an API to update the profile on the server.
        // For this prototype, we save it locally and proceed.
        sessionManager.saveUserName(name)
        Toast.makeText(this, "Welcome, $name!", Toast.LENGTH_SHORT).show()
        startActivity(Intent(this, AccessibilityPickerActivity::class.java))
        finish()
    }

    private fun showPhoneSection() {
        layoutOtpInput.visibility = View.GONE
        layoutNameInput.visibility = View.GONE
        layoutPhoneInput.visibility = View.VISIBLE
        findViewById<TextView>(R.id.screen_title).text = "Sign In"
    }

    private fun showOtpSection() {
        layoutPhoneInput.visibility = View.GONE
        layoutNameInput.visibility = View.GONE
        layoutOtpInput.visibility = View.VISIBLE
        findViewById<TextView>(R.id.screen_title).text = "Verify Phone"
        startResendTimer()
    }

    private fun showNameSection() {
        layoutPhoneInput.visibility = View.GONE
        layoutOtpInput.visibility = View.GONE
        layoutNameInput.visibility = View.VISIBLE
        findViewById<TextView>(R.id.screen_title).text = "Tell us your name"
    }

    private fun startResendTimer() {
        object : CountDownTimer(60000, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                tvResendTimer.text = "Resend code in 00:${String.format("%02d", millisUntilFinished / 1000)}"
            }
            override fun onFinish() {
                tvResendTimer.text = "Resend code now"
                tvResendTimer.isClickable = true
            }
        }.start()
    }

    private fun showExplainSheet(key: String) {
        val explanation = VulaExplainService.getExplanation(key)
        val dialog = BottomSheetDialog(this)
        val view = layoutInflater.inflate(R.layout.layout_explain_sheet, null)

        view.findViewById<TextView>(R.id.tv_vula_title).text = explanation.title
        view.findViewById<TextView>(R.id.tv_summary).text = explanation.summary
        view.findViewById<TextView>(R.id.tv_steps).text = explanation.steps.joinToString("\n") { "• $it" }
        view.findViewById<Button>(R.id.btn_next_action).text = explanation.nextAction

        dialog.setContentView(view)
        dialog.show()
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }

    private fun speakPageContent() {
        val content = "You are on the Sign In page. Enter your mobile number to receive a 6-digit verification code."
        tts.speak(content, TextToSpeech.QUEUE_FLUSH, null, null)
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
