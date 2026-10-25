package com.example.vulindlela

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import com.example.vulindlela.databinding.ActivityOpportunityDetailBinding
import com.example.vulindlela.network.RetrofitClient
import kotlinx.coroutines.launch

class OpportunityDetailActivity : AppCompatActivity() {
    private lateinit var binding: ActivityOpportunityDetailBinding
    private var opportunityId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityOpportunityDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        opportunityId = intent.getStringExtra("OPPORTUNITY_ID")
        val title = intent.getStringExtra("OPPORTUNITY_TITLE")
        val stipend = intent.getDoubleExtra("OPPORTUNITY_STIPEND", 0.0)
        val taxi = intent.getDoubleExtra("OPPORTUNITY_TAXI", 0.0)
        val requirements = intent.getStringArrayListExtra("OPPORTUNITY_REQUIREMENTS")

        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        binding.collapsingToolbar.title = title ?: "Opportunity Details"

        // Initialize with basic intent data
        binding.tvDetailStipend.text = if (stipend > 0) "R${stipend.toInt()}" else "TBC"
        binding.tvDetailTaxi.text = if (taxi > 0) "~R${taxi.toInt()}" else "TBC"
        binding.tvDetailRequirements.text = requirements?.joinToString("\n") { "• $it" } ?: "• No specific requirements listed"

        ViewCompat.setOnApplyWindowInsetsListener(binding.root) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, 0, systemBars.right, systemBars.bottom)
            insets
        }

        loadFitScore()

        binding.btnApplyNow.setOnClickListener {
            applyNow()
        }
    }

    private fun loadFitScore() {
        val id = opportunityId ?: return
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.api.getFitScore(id)
                if (response.isSuccessful) {
                    val fit = response.body()
                    fit?.let {
                        binding.tvFitScore.text = "${it.score}% Fit Score"
                        binding.tvFitExplanation.text = it.explanation
                        
                        if (it.bridge != null) {
                            binding.cardBridge.visibility = View.VISIBLE
                            binding.tvBridgeText.text = it.bridge
                        }
                    }
                }
            } catch (e: Exception) {
                binding.tvFitScore.text = "Score unavailable"
            }
        }
    }

    private fun applyNow() {
        val id = opportunityId ?: return
        lifecycleScope.launch {
            try {
                binding.btnApplyNow.isEnabled = false
                binding.btnApplyNow.text = "APPLYING..."
                
                val response = RetrofitClient.api.applyForOpportunity(id)
                if (response.isSuccessful) {
                    Toast.makeText(this@OpportunityDetailActivity, "Application successful! Check your tracker for updates.", Toast.LENGTH_LONG).show()
                    finish()
                } else {
                    Toast.makeText(this@OpportunityDetailActivity, "Already applied or error.", Toast.LENGTH_SHORT).show()
                    binding.btnApplyNow.isEnabled = true
                    binding.btnApplyNow.text = "APPLY NOW"
                }
            } catch (e: Exception) {
                Toast.makeText(this@OpportunityDetailActivity, "Connection error.", Toast.LENGTH_SHORT).show()
                binding.btnApplyNow.isEnabled = true
                binding.btnApplyNow.text = "APPLY NOW"
            }
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressedDispatcher.onBackPressed()
        return true
    }
}
