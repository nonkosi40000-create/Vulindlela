package com.example.vulindlela

import android.content.Context
import android.content.SharedPreferences

enum class AppMode {
    STANDARD, BLIND, DEAF, LOW_VISION, MOTOR, COGNITIVE
}

/**
 * CORE REQUIREMENT: C3. Accessibility Mode Picker & B2. Mode-aware navigation
 */
object AccessibilityManager {
    private const val PREFS_NAME = "vulindlela_prefs"
    private const val KEY_MODE = "app_mode"

    private lateinit var prefs: SharedPreferences

    fun init(context: Context) {
        prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    var currentMode: AppMode
        get() = AppMode.valueOf(prefs.getString(KEY_MODE, AppMode.STANDARD.name) ?: AppMode.STANDARD.name)
        set(value) {
            prefs.edit().putString(KEY_MODE, value.name).apply()
        }

    fun applyTheme(context: Context) {
        // This would apply specific styles/themes based on currentMode
        // e.g., setting a high-contrast theme for LOW_VISION
    }
}
