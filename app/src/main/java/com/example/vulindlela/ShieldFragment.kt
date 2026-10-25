package com.example.vulindlela

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.example.vulindlela.databinding.FragmentShieldBinding
import com.example.vulindlela.network.RetrofitClient
import com.example.vulindlela.network.ScamCheckRequest
import com.google.android.material.bottomsheet.BottomSheetDialog
import kotlinx.coroutines.launch

class ShieldFragment : Fragment() {
    private var _binding: FragmentShieldBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentShieldBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.btnCheckScam.setOnClickListener {
            val input = binding.etScamInput.text.toString()
            if (input.isNotEmpty()) {
                performScamCheck(input)
            } else {
                Toast.makeText(requireContext(), "Please paste a message first", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun performScamCheck(text: String) {
        viewLifecycleOwner.lifecycleScope.launch {
            try {
                binding.btnCheckScam.isEnabled = false
                binding.btnCheckScam.text = "ANALYZING..."
                
                val response = RetrofitClient.api.checkScam(ScamCheckRequest(text))
                
                binding.btnCheckScam.isEnabled = true
                binding.btnCheckScam.text = "CHECK FOR SCAMS"

                if (response.isSuccessful) {
                    response.body()?.let { showResultSheet(it.riskLevel, it.explanation, it.reasons) }
                } else {
                    Toast.makeText(requireContext(), "Shield check failed.", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                binding.btnCheckScam.isEnabled = true
                binding.btnCheckScam.text = "CHECK FOR SCAMS"
                Toast.makeText(requireContext(), "Connection error.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun showResultSheet(risk: String, explanation: String, reasons: List<String>) {
        val dialog = BottomSheetDialog(requireContext())
        val view = layoutInflater.inflate(R.layout.view_scam_result, null)
        
        val tvRisk = view.findViewById<TextView>(R.id.tv_scam_level)
        val tvExpl = view.findViewById<TextView>(R.id.tv_scam_explanation)
        val tvReasons = view.findViewById<TextView>(R.id.tv_red_flags)
        val btnDismiss = view.findViewById<Button>(R.id.btn_scam_dismiss)
        
        tvRisk.text = "Risk Level: ${risk.uppercase()}"
        tvRisk.setTextColor(requireContext().getColor(when(risk) {
            "Safe" -> R.color.brand_green
            "Warning" -> R.color.sunrise_gold
            else -> R.color.soft_coral
        }))
        
        tvExpl.text = explanation
        tvReasons.text = reasons.joinToString("\n") { "• $it" }

        btnDismiss.setOnClickListener { dialog.dismiss() }
        
        dialog.setContentView(view)
        dialog.show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
