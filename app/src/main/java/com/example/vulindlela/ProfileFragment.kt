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
import com.example.vulindlela.databinding.FragmentProfileBinding
import com.example.vulindlela.network.RetrofitClient
import com.example.vulindlela.network.SessionManager
import kotlinx.coroutines.launch

class ProfileFragment : Fragment() {
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!
    private lateinit var sessionManager: SessionManager

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        sessionManager = SessionManager(requireContext())
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        binding.tvName.text = sessionManager.fetchUserName()
        
        setupLists()
        loadPassportData()

        binding.btnGetVouched.setOnClickListener {
            generateReferralLink()
        }
    }

    private fun setupLists() {
        binding.rvVerifiedSkills.layoutManager = LinearLayoutManager(requireContext())
        binding.rvVouches.layoutManager = LinearLayoutManager(requireContext())
    }

    private fun loadPassportData() {
        viewLifecycleOwner.lifecycleScope.launch {
            try {
                val assessmentsResponse = RetrofitClient.api.getMyAssessments()
                val vouchesResponse = RetrofitClient.api.getMyVouches()

                if (assessmentsResponse.isSuccessful) {
                    val assessments = assessmentsResponse.body() ?: emptyList()
                    if (assessments.isEmpty()) {
                        binding.tvNoSkills.visibility = View.VISIBLE
                    } else {
                        binding.tvNoSkills.visibility = View.GONE
                        binding.rvVerifiedSkills.adapter = SkillAssessmentAdapter(assessments) { assessment ->
                            val intent = Intent(requireContext(), AssessmentActivity::class.java).apply {
                                putExtra("ASSESSMENT_ID", assessment.id)
                                putExtra("SKILL_NAME", assessment.skillName)
                            }
                            startActivity(intent)
                        }
                    }
                    
                    val verifiedCount = assessments.count { it.status == "VERIFIED" }
                    binding.tvReadinessLevel.text = "Verified Skills: $verifiedCount / ${assessments.size}"
                }

                if (vouchesResponse.isSuccessful) {
                    val vouches = vouchesResponse.body() ?: emptyList()
                    binding.rvVouches.adapter = VouchAdapter(vouches)
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Error loading passport", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun generateReferralLink() {
        val name = sessionManager.fetchUserName()?.lowercase()?.replace(" ", "-") ?: "user"
        val shareIntent = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_SUBJECT, "Vouch for my skills on Vulindlela")
            putExtra(Intent.EXTRA_TEXT, "Hi! Can you vouch for my skills on Vulindlela? Here is my link: https://vulindlela.app/vouch/$name")
        }
        startActivity(Intent.createChooser(shareIntent, "Share link via"))
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
