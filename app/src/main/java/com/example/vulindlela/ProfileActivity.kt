package com.example.vulindlela

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.vulindlela.databinding.ActivityProfileBinding
import com.example.vulindlela.network.SessionManager
import com.google.android.material.chip.Chip

class ProfileActivity : AppCompatActivity() {
    private lateinit var binding: ActivityProfileBinding
    private lateinit var sessionManager: SessionManager
    
    private var currentQuestionIndex = 0
    private val questions = listOf(
        "Where are you currently staying? (e.g. Soweto, JHB)",
        "How old are you?",
        "What is your gender?",
        "What languages do you speak? (e.g. English, Zulu, Sotho)",
        "What is your daily transport budget for work? (e.g. 50)",
        "When are you available to start work? (e.g. Immediately)",
        "What kind of work do you prefer? (e.g. Retail, Office, Driver)",
        "Tell us more about your skills or experience.",
        "Tell us a bit about yourself (Bio).",
        "Profile complete! You can now see matched opportunities."
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)

        ViewCompat.setOnApplyWindowInsetsListener(binding.appBar) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, 0)
            insets
        }

        binding.btnBack.setOnClickListener {
            onBackPressedDispatcher.onBackPressed()
        }

        setupInitialUI()

        binding.btnNextQuestion.setOnClickListener {
            handleAnswer()
        }
    }

    private fun setupInitialUI() {
        binding.tvLiveName.text = sessionManager.fetchUserName()
        updateSkillsUI()
        updateQuestion()
    }

    private fun updateQuestion() {
        if (currentQuestionIndex < questions.size) {
            binding.tvVulaQuestion.text = "Vula: ${questions[currentQuestionIndex]}"
            binding.etAnswer.text.clear()
            binding.cgQuickReplies.removeAllViews()

            // UI Adjustments for specific questions
            when (currentQuestionIndex) {
                1 -> binding.etAnswer.inputType = android.text.InputType.TYPE_CLASS_NUMBER
                2 -> setupQuickReplies(listOf("Male", "Female", "Other"))
                4 -> binding.etAnswer.inputType = android.text.InputType.TYPE_CLASS_NUMBER
                5 -> setupQuickReplies(listOf("Immediately", "1 week", "1 month"))
                6 -> setupQuickReplies(listOf("Retail", "Security", "Admin", "Driver"))
                else -> binding.etAnswer.inputType = android.text.InputType.TYPE_CLASS_TEXT
            }
            
            if (currentQuestionIndex == questions.size - 1) {
                binding.etAnswer.visibility = View.GONE
                binding.btnVoiceInput.visibility = View.GONE
                binding.btnNextQuestion.text = "FINISH"
            }
        } else {
            finish()
        }
    }

    private fun setupQuickReplies(replies: List<String>) {
        for (reply in replies) {
            val chip = Chip(this)
            chip.text = reply
            chip.setOnClickListener {
                binding.etAnswer.setText(reply)
                handleAnswer()
            }
            binding.cgQuickReplies.addView(chip)
        }
    }

    private fun handleAnswer() {
        val answer = binding.etAnswer.text.toString().trim()
        
        if (currentQuestionIndex < questions.size - 1 && answer.isEmpty()) {
            Toast.makeText(this, "Please provide an answer", Toast.LENGTH_SHORT).show()
            return
        }

        when (currentQuestionIndex) {
            0 -> {
                sessionManager.saveArea(answer)
                binding.tvLiveSummary.text = "Staying in $answer"
            }
            1 -> sessionManager.saveAge(answer.toIntOrNull() ?: 0)
            2 -> sessionManager.saveGender(answer)
            3 -> sessionManager.saveLanguages(answer)
            4 -> sessionManager.saveBudget(answer.toFloatOrNull() ?: 0f)
            5 -> sessionManager.saveAvailability(answer)
            6 -> sessionManager.saveWorkPref(answer)
            7 -> {
                val newSkills = answer.split(",").map { it.trim() }.filter { it.isNotEmpty() }
                val currentSkills = sessionManager.fetchSkills().toMutableList()
                currentSkills.addAll(newSkills)
                sessionManager.saveSkills(currentSkills.distinct())
                updateSkillsUI()
            }
            8 -> sessionManager.saveBio(answer)
        }

        currentQuestionIndex++
        updateQuestion()
    }

    private fun updateSkillsUI() {
        binding.cgSkills.removeAllViews()
        val skills = sessionManager.fetchSkills()
        for (skill in skills) {
            val chip = Chip(this)
            chip.text = skill
            chip.isClickable = false
            chip.setChipBackgroundColorResource(R.color.brand_green)
            chip.setTextColor(getColor(R.color.brand_white))
            binding.cgSkills.addView(chip)
        }
    }
}
