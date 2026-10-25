package com.example.vulindlela

import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity

class GuardianConsentActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_guardian_consent)

        findViewById<Button>(R.id.btn_send_request)?.setOnClickListener {
            Toast.makeText(this, "Permission request sent to guardian", Toast.LENGTH_LONG).show()
            finish()
        }
    }
}
