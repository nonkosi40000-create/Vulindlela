package com.example.vulindlela

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.vulindlela.databinding.FragmentOpportunitiesBinding
import com.example.vulindlela.network.RetrofitClient
import com.example.vulindlela.network.Opportunity
import kotlinx.coroutines.launch

class OpportunitiesFragment : Fragment() {
    private var _binding: FragmentOpportunitiesBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentOpportunitiesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.rvOpportunities.layoutManager = LinearLayoutManager(requireContext())
        loadOpportunities()
    }

    private fun loadOpportunities() {
        viewLifecycleOwner.lifecycleScope.launch {
            try {
                val response = RetrofitClient.api.getOpportunities()
                if (response.isSuccessful) {
                    val opps = response.body() ?: emptyList()
                    setOpportunities(opps)
                } else {
                    showMockData()
                }
            } catch (e: Exception) {
                showMockData()
            }
        }
    }

    private fun setOpportunities(opps: List<Opportunity>) {
        binding.rvOpportunities.adapter = OpportunityAdapter(opps) { opportunity ->
            val intent = Intent(requireContext(), OpportunityDetailActivity::class.java).apply {
                putExtra("OPPORTUNITY_ID", opportunity.id)
                putExtra("OPPORTUNITY_TITLE", opportunity.title)
                putExtra("OPPORTUNITY_STIPEND", opportunity.stipend ?: 0.0)
                putExtra("OPPORTUNITY_TAXI", opportunity.estimatedTaxi ?: 0.0)
                putStringArrayListExtra("OPPORTUNITY_REQUIREMENTS", ArrayList(opportunity.requirements))
            }
            startActivity(intent)
        }
    }

    private fun showMockData() {
        // Fallback for demo when backend is offline
        val mockOpps = listOf(
            Opportunity("1", "Retail Learnership", "Work at a top retailer", "LEARNERSHIP", "Midrand, JHB", 4500.0, 450.0, "GREEN", listOf("Grade 12", "Good communication")),
            Opportunity("2", "Delivery Assistant", "Help with logistics", "MICRO_INTERNSHIP", "Soweto, Gauteng", 3200.0, 150.0, "YELLOW", listOf("Hardworking", "Physical fitness"))
        )
        setOpportunities(mockOpps)
        Toast.makeText(requireContext(), "Showing offline opportunities", Toast.LENGTH_SHORT).show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
