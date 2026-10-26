package com.example.vulindlela.network

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

class SessionManager(context: Context) {
    val prefs: SharedPreferences = context.getSharedPreferences("vulindlela_prefs", Context.MODE_PRIVATE)
    private val gson = Gson()

    companion object {
        const val USER_TOKEN = "user_token"
        const val USER_NAME = "user_name"
        const val USER_PASSWORD_HASH = "user_password_hash"
        const val USER_AREA = "user_area"
        const val USER_SKILLS = "user_skills"
        const val USER_BUDGET = "user_budget"
        const val USER_BIO = "user_bio"
        const val USER_AVAILABILITY = "user_availability"
        const val USER_WORK_PREF = "user_work_pref"
        const val USER_AGE = "user_age"
        const val USER_GENDER = "user_gender"
        const val USER_LANGUAGES = "user_languages"
    }

    fun saveAuthToken(token: String) {
        prefs.edit().putString(USER_TOKEN, token).apply()
    }

    fun fetchAuthToken(): String? = prefs.getString(USER_TOKEN, null)

    fun saveUserName(name: String) {
        prefs.edit().putString(USER_NAME, name).apply()
    }

    fun fetchUserName(): String? = prefs.getString(USER_NAME, "User")

    fun savePasswordHash(hash: String) {
        prefs.edit().putString(USER_PASSWORD_HASH, hash).apply()
    }

    fun fetchPasswordHash(): String? = prefs.getString(USER_PASSWORD_HASH, null)

    fun saveArea(area: String) {
        prefs.edit().putString(USER_AREA, area).apply()
    }

    fun fetchArea(): String? = prefs.getString(USER_AREA, null)

    fun saveBudget(budget: Float) {
        prefs.edit().putFloat(USER_BUDGET, budget).apply()
    }

    fun fetchBudget(): Float = prefs.getFloat(USER_BUDGET, 0f)

    fun saveSkills(skills: List<String>) {
        val json = gson.toJson(skills)
        prefs.edit().putString(USER_SKILLS, json).apply()
    }

    fun fetchSkills(): List<String> {
        val json = prefs.getString(USER_SKILLS, null) ?: return emptyList()
        val type = object : TypeToken<List<String>>() {}.type
        return gson.fromJson(json, type)
    }

    fun saveAvailability(avail: String) {
        prefs.edit().putString(USER_AVAILABILITY, avail).apply()
    }

    fun fetchAvailability(): String? = prefs.getString(USER_AVAILABILITY, null)

    fun saveWorkPref(pref: String) {
        prefs.edit().putString(USER_WORK_PREF, pref).apply()
    }

    fun fetchWorkPref(): String? = prefs.getString(USER_WORK_PREF, null)

    fun saveAge(age: Int) {
        prefs.edit().putInt(USER_AGE, age).apply()
    }

    fun fetchAge(): Int = prefs.getInt(USER_AGE, 0)

    fun saveGender(gender: String) {
        prefs.edit().putString(USER_GENDER, gender).apply()
    }

    fun fetchGender(): String? = prefs.getString(USER_GENDER, null)

    fun saveLanguages(langs: String) {
        prefs.edit().putString(USER_LANGUAGES, langs).apply()
    }

    fun fetchLanguages(): String? = prefs.getString(USER_LANGUAGES, null)

    fun saveBio(bio: String) {
        prefs.edit().putString(USER_BIO, bio).apply()
    }

    fun fetchBio(): String? = prefs.getString(USER_BIO, null)

    fun logout() {
        prefs.edit().clear().apply()
    }
}