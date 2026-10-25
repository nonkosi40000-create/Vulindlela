package com.example.vulindlela

/**
 * VulaExplainService
 * Grounded AI Logic for V1.
 * Provides Grade 6 explanations in 5 languages.
 */
object VulaExplainService {

    data class VulaExplanation(
        val title: String,
        val summary: String,
        val steps: List<String>,
        val nextAction: String,
        val nextActionRoute: String? = null,
        val voiceScript: String = "",
        val followUps: List<String> = emptyList()
    )

    private val staticKnowledgeBase = mapOf(
        "login_page" to mapOf(
            "en" to VulaExplanation(
                "Sign In",
                "Enter your mobile number to get a secure code via SMS.",
                listOf("Enter SA mobile number", "Receive 6-digit code", "Verify and enter"),
                "Get Started"
            )
        ),
        "access_picker" to mapOf(
            "en" to VulaExplanation(
                "Accessibility",
                "Choose how you want to use the app based on your needs.",
                listOf("Standard mode", "Blind mode", "Low vision mode", "Motor mode"),
                "Continue"
            )
        ),
        "dash_home" to mapOf(
            "en" to VulaExplanation(
                "Home Dashboard",
                "This is your starting point for finding work safely.",
                listOf("Check your today's summary", "See new job matches", "View safety alerts"),
                "Find Work"
            )
        ),
        "why_phone" to mapOf(
            "en" to VulaExplanation(
                "Mobile Number",
                "We use your number to keep your account safe without needing a password.",
                listOf("We send a one-time code", "Only you can see your messages", "We never share your number"),
                "I understand"
            )
        )
    )

    fun getExplanation(key: String, lang: String = "en"): VulaExplanation {
        val entry = staticKnowledgeBase[key]
        return entry?.get(lang) ?: entry?.get("en") ?: VulaExplanation(
            "Vula Guide",
            "I can explain any part of this screen to you in simple words.",
            listOf("Tap any 'Explain' button", "Ask me a question by voice"),
            "Got it"
        )
    }
}
