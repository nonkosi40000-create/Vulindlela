package com.example.vulindlela.network

import android.content.Context
import android.content.SharedPreferences

class SessionManager(context: Context) {
    private var prefs: SharedPreferences = context.getSharedPreferences("vulindlela_prefs", Context.MODE_PRIVATE)

    companion object {
        const val USER_TOKEN = "user_token"
        const val USER_NAME = "user_name"
    }

    fun saveAuthToken(token: String) {
        val editor = prefs.edit()
        editor.putString(USER_TOKEN, token)
        editor.apply()
    }

    fun fetchAuthToken(): String? {
        return prefs.getString(USER_TOKEN, null)
    }

    fun saveUserName(name: String) {
        val editor = prefs.edit()
        editor.putString(USER_NAME, name)
        editor.apply()
    }

    fun fetchUserName(): String? {
        return prefs.getString(USER_NAME, "User")
    }
}