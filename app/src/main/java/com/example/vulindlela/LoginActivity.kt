package com.example.vulindlela

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import com.example.vulindlela.network.SessionManager
import java.security.MessageDigest

class LoginActivity : AppCompatActivity() {

    private lateinit var etName: EditText
    private lateinit var etPassword: EditText
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_login)

        sessionManager = SessionManager(this)
        etName = findViewById(R.id.et_login_name)
        etPassword = findViewById(R.id.et_login_password)

        findViewById<Button>(R.id.btn_login).setOnClickListener {
            val nameInput = etName.text.toString().trim()
            val passwordInput = etPassword.text.toString()

            if (nameInput.isNotBlank() && passwordInput.isNotBlank()) {
                val storedName = sessionManager.fetchUserName()
                val storedHash = sessionManager.fetchPasswordHash()

                // Check if user exists and password matches
                if (nameInput.equals(storedName, ignoreCase = true)) {
                    val inputHash = hashPassword(passwordInput)
                    
                    if (inputHash == storedHash) {
                        sessionManager.saveAuthToken("secure_token_$inputHash")
                        Toast.makeText(this, "Welcome back, $storedName!", Toast.LENGTH_SHORT).show()
                        startActivity(Intent(this, DashboardActivity::class.java))
                        finish()
                    } else {
                        Toast.makeText(this, "Incorrect password. Please try again.", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    Toast.makeText(this, "User not found. Please register first.", Toast.LENGTH_SHORT).show()
                }
            } else {
                Toast.makeText(this, "Please enter both name and password", Toast.LENGTH_SHORT).show()
            }
        }

        findViewById<TextView>(R.id.tv_go_to_register).setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
            finish()
        }

        findViewById<View>(R.id.btn_back).setOnClickListener {
            onBackPressedDispatcher.onBackPressed()
        }
    }

    private fun hashPassword(password: String): String {
        val bytes = password.toByteArray()
        val md = MessageDigest.getInstance("SHA-256")
        val digest = md.digest(bytes)
        return digest.fold("") { str, it -> str + "%02x".format(it) }
    }
}
