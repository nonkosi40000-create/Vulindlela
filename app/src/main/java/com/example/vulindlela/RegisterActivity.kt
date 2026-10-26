package com.example.vulindlela

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import com.example.vulindlela.network.SessionManager
import java.security.MessageDigest
import java.util.regex.Pattern

class RegisterActivity : AppCompatActivity() {

    private lateinit var etName: EditText
    private lateinit var etPassword: EditText
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_register)

        sessionManager = SessionManager(this)
        etName = findViewById(R.id.et_register_name)
        etPassword = findViewById(R.id.et_register_password)

        findViewById<Button>(R.id.btn_register).setOnClickListener {
            val name = etName.text.toString().trim()
            val password = etPassword.text.toString()

            if (validateInput(name, password)) {
                // Encryption: Hash the password before storing
                val hashedPassword = hashPassword(password)
                
                // Save name and hashed password to local storage
                sessionManager.saveUserName(name)
                sessionManager.savePasswordHash(hashedPassword)
                sessionManager.saveAuthToken("secure_token_$hashedPassword")
                
                Toast.makeText(this, "Account created! Welcome, $name", Toast.LENGTH_SHORT).show()
                startActivity(Intent(this, AccessibilityPickerActivity::class.java))
                finish()
            }
        }

        findViewById<TextView>(R.id.tv_go_to_login).setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }

        findViewById<android.view.View>(R.id.btn_back).setOnClickListener {
            onBackPressedDispatcher.onBackPressed()
        }
    }

    private fun validateInput(name: String, pass: String): Boolean {
        if (name.isEmpty()) {
            Toast.makeText(this, "Please enter your name", Toast.LENGTH_SHORT).show()
            return false
        }

        if (pass.length < 8) {
            Toast.makeText(this, "Password must be at least 8 characters", Toast.LENGTH_SHORT).show()
            return false
        }

        val specialCharPattern = Pattern.compile("[^a-zA-Z0-9]")
        if (!specialCharPattern.matcher(pass).find()) {
            Toast.makeText(this, "Password must contain at least one special character (!@# etc.)", Toast.LENGTH_SHORT).show()
            return false
        }

        return true
    }

    private fun hashPassword(password: String): String {
        val bytes = password.toByteArray()
        val md = MessageDigest.getInstance("SHA-256")
        val digest = md.digest(bytes)
        return digest.fold("") { str, it -> str + "%02x".format(it) }
    }
}
