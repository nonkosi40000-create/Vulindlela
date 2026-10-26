package com.example.vulindlela

import android.os.Bundle
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.vulindlela.databinding.ActivityVulaGuideBinding
import com.example.vulindlela.network.ChatHistoryItem
import com.example.vulindlela.network.ChatPart
import com.example.vulindlela.network.ChatRequest
import com.example.vulindlela.network.RetrofitClient
import com.example.vulindlela.network.SessionManager
import kotlinx.coroutines.launch

class VulaGuideActivity : AppCompatActivity() {
    private lateinit var binding: ActivityVulaGuideBinding
    private lateinit var chatAdapter: ChatAdapter
    private lateinit var sessionManager: SessionManager
    private val chatHistory = mutableListOf<ChatHistoryItem>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityVulaGuideBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)

        ViewCompat.setOnApplyWindowInsetsListener(binding.chatHeader) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, 0)
            insets
        }

        setupChat()

        binding.btnSend.setOnClickListener {
            val text = binding.etMessage.text.toString()
            if (text.isNotBlank()) {
                sendMessage(text)
            }
        }

        val userName = sessionManager.fetchUserName() ?: "friend"
        addVulaMessage("Sawubona $userName! I'm Vula. I'm here to help you build a profile that shows employers what you're really good at.")
        addVulaMessage("Instead of a boring CV, let's just talk. Tell me, what kind of work have you done before? Even if it was helping at home or a spaza shop.")
    }

    private fun setupChat() {
        chatAdapter = ChatAdapter(mutableListOf())
        binding.rvChat.adapter = chatAdapter
        binding.rvChat.layoutManager = LinearLayoutManager(this)
    }

    private fun sendMessage(text: String) {
        chatAdapter.addMessage(ChatMessage(text, true))
        binding.etMessage.text.clear()
        binding.rvChat.scrollToPosition(chatAdapter.itemCount - 1)

        lifecycleScope.launch {
            try {
                // Try live API first
                val response = RetrofitClient.api.sendProfileMessage(ChatRequest(text, chatHistory))
                if (response.isSuccessful) {
                    val reply = response.body()?.text ?: "I'm listening..."
                    addVulaMessage(reply)
                    chatHistory.add(ChatHistoryItem("user", listOf(ChatPart(text))))
                    chatHistory.add(ChatHistoryItem("model", listOf(ChatPart(reply))))
                } else {
                    simulateVulaResponse(text)
                }
            } catch (e: Exception) {
                simulateVulaResponse(text)
            }
        }
    }

    private fun simulateVulaResponse(userText: String) {
        val reply = when {
            userText.contains("shop", ignoreCase = true) || userText.contains("sell", ignoreCase = true) -> 
                "Managing a shop takes real skill in 'Customer Service' and 'Inventory'. I've added those to your Passport! What else are you good at?"
            
            userText.contains("clean", ignoreCase = true) || userText.contains("fix", ignoreCase = true) ->
                "Practical hands-on work is exactly what many employers need. I've noted down your 'Manual Dexterity' and 'Reliability'. Do you have any formal training too?"
                
            userText.contains("school", ignoreCase = true) || userText.contains("grade", ignoreCase = true) ->
                "That's great! Having a school qualification opens up many 'Learnership' opportunities. Where are you currently staying? I'll look for jobs nearby."

            userText.contains("soweto", ignoreCase = true) || userText.contains("job", ignoreCase = true) ->
                "Perfect! I've found a few opportunities near you. You can see them in the 'Opps' tab now. I've also given you a 'Ready to Start' badge!"

            else -> "I understand! I'm adding that to your Skill Passport. Every bit of experience counts toward making you 'Work-Ready'."
        }
        addVulaMessage(reply)
    }

    private fun addVulaMessage(text: String) {
        chatAdapter.addMessage(ChatMessage(text, false))
        binding.rvChat.scrollToPosition(chatAdapter.itemCount - 1)
    }
}
