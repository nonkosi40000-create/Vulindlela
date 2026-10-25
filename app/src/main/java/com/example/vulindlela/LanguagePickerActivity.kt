package com.example.vulindlela

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity

class LanguagePickerActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_language_picker)

        // Find buttons and set navigation (Simplified for UI flow)
        findViewById<Button>(R.id.btn_en)?.setOnClickListener { goToPopia() }
        findViewById<Button>(R.id.btn_zu)?.setOnClickListener { goToPopia() }
        findViewById<Button>(R.id.btn_xh)?.setOnClickListener { goToPopia() }
    }

    private fun goToPopia() {
        startActivity(Intent(this, PopiaActivity::class.java))
    }
}
