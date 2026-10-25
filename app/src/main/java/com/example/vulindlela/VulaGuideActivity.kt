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
import kotlinx.coroutines.launch

class VulaGuideActivity : AppCompatActivity() {
    private lateinit var binding: ActivityVulaGuideBinding
    private lateinit var chatAdapter: ChatAdapter
    private val chatHistory = mutableListOf<ChatHistoryItem>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityVulaGuideBinding.inflate(layoutInflater)
        setContentView(binding.root)

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

        // Initial welcome message from Vula
        addVulaMessage("Sawubona! I'm Vula, your guide to finding the right work. Can you tell me your name and what kind of things you're good at?")
    }

    private fun setupChat() {
        chatAdapter = ChatAdapter(mutableListOf())
        binding.rvChat.adapter = chatAdapter
        binding.rvChat.layoutManager = LinearLayoutManager(this)
    }

    private fun sendMessage(text: String) {
        // 1. Add user message to UI
        chatAdapter.addMessage(ChatMessage(text, true))
        binding.etMessage.text.clear()
        binding.rvChat.scrollToPosition(chatAdapter.itemCount - 1)

        // 2. Call AI API
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.api.sendProfileMessage(ChatRequest(text, chatHistory))
                if (response.isSuccessful) {
                    val reply = response.body()?.text ?: "I'm not sure how to respond to that."
                    addVulaMessage(reply)
                    
                    // Update history for context
                    chatHistory.add(ChatHistoryItem("user", listOf(ChatPart(text))))
                    chatHistory.add(ChatHistoryItem("model", listOf(ChatPart(reply))))
                } else {
                    Toast.makeText(this@VulaGuideActivity, "Vula is having trouble connecting.", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@VulaGuideActivity, "Connection error.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun addVulaMessage(text: String) {
        chatAdapter.addMessage(ChatMessage(text, false))
        binding.rvChat.scrollToPosition(chatAdapter.itemCount - 1)
    }
}
