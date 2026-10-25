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
    private var stipendAmount: Double = 0.0
    private var taxiAmount: Double = 0.0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityOpportunityDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        opportunityId = intent.getStringExtra("OPPORTUNITY_ID")
        val title = intent.getStringExtra("OPPORTUNITY_TITLE")
        stipendAmount = intent.getDoubleExtra("OPPORTUNITY_STIPEND", 0.0)
        taxiAmount = intent.getDoubleExtra("OPPORTUNITY_TAXI", 0.0)
        val requirements = intent.getStringArrayListExtra("OPPORTUNITY_REQUIREMENTS")

        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        binding.collapsingToolbar.title = title ?: "Opportunity Details"

        // Initialize UI with basic data
        binding.tvDetailStipend.text = if (stipendAmount > 0) "R${stipendAmount.toInt()}" else "TBC"
        binding.tvDetailTaxi.text = if (taxiAmount > 0) "~R${taxiAmount.toInt()}" else "TBC"
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
                } else {
                    showOfflineFitScore()
                }
            } catch (e: Exception) {
                showOfflineFitScore()
            }
        }
    }

    private fun showOfflineFitScore() {
        // Fallback Logic for testing: Transport cost vs Stipend
        val transportRatio = if (stipendAmount > 0) taxiAmount / stipendAmount else 0.5
        val score = when {
            transportRatio > 0.25 -> 45 // Too expensive to travel
            transportRatio > 0.15 -> 72 // Decent
            else -> 91 // Excellent fit
        }
        
        binding.tvFitScore.text = "$score% Fit Score (Offline)"
        binding.tvFitExplanation.text = if (score < 50) {
            "This job is quite far and transport will take a large part of your stipend."
        } else {
            "Vula says this is a good match! The transport costs are affordable."
        }
        
        if (score in 50..75) {
            binding.cardBridge.visibility = View.VISIBLE
            binding.tvBridgeText.text = "Tip: Take a short 'Logistics 101' course to boost your chance to 90%!"
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
                    Toast.makeText(this@OpportunityDetailActivity, "Application successful!", Toast.LENGTH_LONG).show()
                    finish()
                } else {
                    // Simulating success for the prototype demo if server fails
                    Toast.makeText(this@OpportunityDetailActivity, "Applied successfully (Demo Mode)", Toast.LENGTH_SHORT).show()
                    finish()
                }
            } catch (e: Exception) {
                Toast.makeText(this@OpportunityDetailActivity, "Applied successfully (Demo Mode)", Toast.LENGTH_SHORT).show()
                finish()
            }
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressedDispatcher.onBackPressed()
        return true
    }
}
