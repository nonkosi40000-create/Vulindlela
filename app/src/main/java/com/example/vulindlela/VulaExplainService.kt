package com.example.vulindlela

/**
 * VulaExplainService
 * Provides simplified Grade 6 explanations for key screens.
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
                "Simply enter your name to access your verified profile and job matches.",
                listOf("Enter your full name", "Tap Sign In", "Continue your journey"),
                "Get Started"
            )
        ),
        "register_page" to mapOf(
            "en" to VulaExplanation(
                "Create Account",
                "Join Vulindlela to build a verified Skill Passport instead of a CV.",
                listOf("Enter your full name", "Tell Vula about your skills", "Get verified by your community"),
                "Join Now"
            )
        ),
        "access_picker" to mapOf(
            "en" to VulaExplanation(
                "Accessibility",
                "Choose how you want to use the app based on your needs.",
                listOf("Standard mode", "Blind mode (Voice first)", "Low vision mode", "Motor mode"),
                "Continue"
            )
        ),
        "dash_home" to mapOf(
            "en" to VulaExplanation(
                "Home Dashboard",
                "This is your starting point for finding work safely.",
                listOf("See your daily summary", "Check for new job matches", "View important safety alerts"),
                "Find Work"
            )
        )
    )

    fun getExplanation(key: String, lang: String = "en"): VulaExplanation {
        val entry = staticKnowledgeBase[key]
        return entry?.get(lang) ?: entry?.get("en") ?: VulaExplanation(
            "Vula Guide",
            "I can explain any part of this screen to you in simple words.",
            listOf("Tap any 'Explain' button", "Ask me a question in the chat"),
            "Got it"
        )
    }
}
