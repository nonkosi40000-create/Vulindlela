package com.example.vulindlela

import android.os.Bundle
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.vulindlela.databinding.ActivityAssessmentBinding
import com.example.vulindlela.network.RetrofitClient
import com.example.vulindlela.network.SubmitAssessmentRequest
import kotlinx.coroutines.launch

class AssessmentActivity : AppCompatActivity() {
    private lateinit var binding: ActivityAssessmentBinding
    private var assessmentId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityAssessmentBinding.inflate(layoutInflater)
        setContentView(binding.root)

        assessmentId = intent.getStringExtra("ASSESSMENT_ID")
        val skillName = intent.getStringExtra("SKILL_NAME")

        binding.tvAssessmentTitle.text = "Vetting: $skillName"
        
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        binding.toolbar.setNavigationOnClickListener { onBackPressedDispatcher.onBackPressed() }

        binding.btnSubmitAssessment.setOnClickListener {
            val submission = binding.etSubmission.text.toString()
            if (submission.isNotBlank()) {
                submitWork(submission)
            } else {
                Toast.makeText(this, "Please enter your response", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun submitWork(text: String) {
        val id = assessmentId ?: return
        lifecycleScope.launch {
            try {
                // In a real app, we'd upload text as a deliverable. 
                // For MVP, we send the text as the evidenceUrl.
                val response = RetrofitClient.api.submitAssessment(id, SubmitAssessmentRequest(text))
                if (response.isSuccessful) {
                    Toast.makeText(this@AssessmentActivity, "Submitted! Vula will review this soon.", Toast.LENGTH_LONG).show()
                    finish()
                } else {
                    Toast.makeText(this@AssessmentActivity, "Submission failed.", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@AssessmentActivity, "Connection error.", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
